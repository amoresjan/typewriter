from django.urls import path
from .views import SaveResultView

urlpatterns = [
    path('', SaveResultView.as_view(), name='save-result'),
]
