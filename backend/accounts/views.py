from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import AnonRateThrottle


@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


class AuthRateThrottle(AnonRateThrottle):
    rate = '10/minute'
    scope = 'auth'
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
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response({'id': str(user.id), 'username': user.username}, status=status.HTTP_201_CREATED)
        _set_jwt_cookies(response, refresh)
        return response


class LoginView(APIView):
    throttle_classes = [AuthRateThrottle]

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
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except (TokenError, InvalidToken):
                pass
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
            # Rotate: blacklists old token and returns a new one
            refresh.blacklist()
            new_refresh = RefreshToken.for_user(user)
        except (TokenError, InvalidToken, User.DoesNotExist):
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        response = Response({'id': str(user.id), 'username': user.username})
        _set_jwt_cookies(response, new_refresh)
        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Max, Avg, Count
        from results.models import GameResult

        stats = GameResult.objects.filter(user=request.user).aggregate(
            best_wpm=Max('wpm'),
            avg_accuracy=Avg('accuracy'),
            total_games=Count('id'),
        )
        return Response({
            'id': str(request.user.id),
            'username': request.user.username,
            'best_wpm': stats['best_wpm'] or 0,
            'avg_accuracy': round(stats['avg_accuracy'] or 0),
            'total_games': stats['total_games'],
        })
