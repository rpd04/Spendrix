from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from .models import Expense, Budget
from .serializers import ExpenseSerializer, BudgetSerializer
import datetime

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_summary(request):
    today = datetime.date.today()
    month = today.month
    year = today.year

    budgets = Budget.objects.filter(
        user=request.user,
        month=month,
        year=year
    )

    summary = []
    for budget in budgets:
        spent = Expense.objects.filter(
            user=request.user,
            category=budget.category,
            date__month=month,
            date__year=year
        ).aggregate(total=Sum('amount'))['total'] or 0

        percentage = (float(spent) / float(budget.amount)) * 100 if budget.amount > 0 else 0

        summary.append({
            'category': budget.category,
            'budget': float(budget.amount),
            'spent': float(spent),
            'percentage': round(percentage, 1),
            'status': 'danger' if percentage >= 80 else 'safe'
        })

    return Response(summary)