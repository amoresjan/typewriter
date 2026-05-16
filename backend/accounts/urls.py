from django.urls import path
from .views import RegisterView, LoginView, LogoutView, RefreshView, ProfileView, csrf_token_view

urlpatterns = [
    path('csrf/', csrf_token_view, name='auth-csrf'),
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('refresh/', RefreshView.as_view(), name='auth-refresh'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
]
