from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import RegisterSerializer


def _set_jwt_cookies(response, refresh):
    secure = not settings.DEBUG
    samesite = 'Lax' if settings.DEBUG else 'None'
    response.set_cookie(
        key='access_token',
        value=str(refresh.access_token),
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=60 * 15,
        path='/',
    )
    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=60 * 60 * 24 * 7,
        path='/',
    )


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response({'id': str(user.id), 'username': user.username})
        _set_jwt_cookies(response, refresh)
        return response


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        refresh = RefreshToken.for_user(user)
        response = Response({'id': str(user.id), 'username': user.username})
        _set_jwt_cookies(response, refresh)
        return response


class LogoutView(APIView):
    def post(self, request):
        secure = not settings.DEBUG
        samesite = 'Lax' if settings.DEBUG else 'None'
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access_token', path='/', samesite=samesite)
        response.delete_cookie('refresh_token', path='/', samesite=samesite)
        return response


class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'No refresh token'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        try:
            refresh = RefreshToken(refresh_token)
            user = User.objects.get(id=refresh['user_id'])
        except (TokenError, InvalidToken, User.DoesNotExist):
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        response = Response({'id': str(user.id), 'username': user.username})
        _set_jwt_cookies(response, refresh)
        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Max, Avg
        from results.models import GameResult

        qs = GameResult.objects.filter(user=request.user)
        stats = qs.aggregate(best_wpm=Max('wpm'), avg_accuracy=Avg('accuracy'))
        return Response({
            'id': str(request.user.id),
            'username': request.user.username,
            'best_wpm': stats['best_wpm'] or 0,
            'avg_accuracy': round(stats['avg_accuracy'] or 0),
            'total_games': qs.count(),
        })
