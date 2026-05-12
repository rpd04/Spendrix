import numpy as np
from datetime import date
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Expense


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def spending_predictions(request):
    today = date.today()
    month = today.month
    year = today.year
    day_of_month = today.day

    # Get this month's expenses
    this_month_expenses = Expense.objects.filter(
        user=request.user,
        date__month=month,
        date__year=year
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Calculate daily average this month
    daily_average = float(this_month_expenses) / day_of_month if day_of_month > 0 else 0

    # Days remaining in month
    if month == 12:
        days_in_month = 31
    else:
        days_in_month = (date(year, month + 1, 1) - date(year, month, 1)).days

    days_remaining = days_in_month - day_of_month

    # Predicted month end total
    predicted_total = float(this_month_expenses) + (daily_average * days_remaining)

    # Get last 3 months spending for trend
    monthly_totals = []
    for i in range(3, 0, -1):
        m = month - i
        y = year
        if m <= 0:
            m += 12
            y -= 1
        total = Expense.objects.filter(
            user=request.user,
            date__month=m,
            date__year=y
        ).aggregate(total=Sum('amount'))['total'] or 0
        monthly_totals.append(float(total))

    # Trend analysis
    if len(monthly_totals) >= 2 and monthly_totals[-1] > 0:
        trend = monthly_totals[-1] - monthly_totals[-2]
        if trend > 0:
            trend_message = f"Your spending increased by ₹{abs(trend):.0f} last month"
            trend_direction = "up"
        elif trend < 0:
            trend_message = f"Your spending decreased by ₹{abs(trend):.0f} last month"
            trend_direction = "down"
        else:
            trend_message = "Your spending is stable"
            trend_direction = "stable"
    else:
        trend_message = "Not enough data for trend analysis"
        trend_direction = "stable"

    # Category analysis — biggest spender
    category_totals = Expense.objects.filter(
        user=request.user,
        date__month=month,
        date__year=year
    ).values('category').annotate(total=Sum('amount')).order_by('-total')

    top_category = category_totals.first()

    # Anomaly detection — expenses 2x higher than daily average
    recent_expenses = Expense.objects.filter(
        user=request.user,
        date__month=month,
        date__year=year
    ).order_by('-date')[:10]

    anomalies = []
    if daily_average > 0:
        for expense in recent_expenses:
            if float(expense.amount) > daily_average * 2:
                anomalies.append({
                    'title': expense.title,
                    'amount': float(expense.amount),
                    'date': str(expense.date)
                })

    return Response({
        'current_spending': float(this_month_expenses),
        'daily_average': round(daily_average, 2),
        'predicted_total': round(predicted_total, 2),
        'days_remaining': days_remaining,
        'trend_message': trend_message,
        'trend_direction': trend_direction,
        'top_category': top_category['category'] if top_category else None,
        'top_category_amount': float(top_category['total']) if top_category else 0,
        'anomalies': anomalies,
        'monthly_history': monthly_totals
    })