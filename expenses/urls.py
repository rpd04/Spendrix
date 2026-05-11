from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ExpenseViewSet, BudgetViewSet, budget_summary, export_csv

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = router.urls + [
    path('budget-summary/', budget_summary, name='budget-summary'),
    path('export-csv/', export_csv, name='export-csv'),
]