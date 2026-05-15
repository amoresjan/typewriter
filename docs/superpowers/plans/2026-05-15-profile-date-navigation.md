# Profile & Date Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add JWT-based user auth (register/login), a profile modal with stats, and a calendar date-picker in the header so users can play any past day's article.

**Architecture:** Django `accounts` app handles JWT auth via httpOnly cookies with a custom `CookieJWTAuthentication` class. A new `results` app stores `GameResult` (user × news, unique). The frontend adds `AuthProvider` context, an `AuthModal` (login/register when logged out, stats + logout when logged in), a shadcn Calendar popover on the header date, and a best-effort result sync on game completion.

**Tech Stack:** `djangorestframework-simplejwt`, `@radix-ui/react-popover`, `react-day-picker`, `date-fns`, shadcn Calendar + Popover components, TanStack Query

---

## File Map

### New backend files
- `backend/accounts/__init__.py`
- `backend/accounts/apps.py`
- `backend/accounts/authentication.py` — reads JWT from `access_token` cookie
- `backend/accounts/serializers.py`
- `backend/accounts/views.py` — register, login, logout, refresh, profile
- `backend/accounts/urls.py`
- `backend/accounts/tests.py`
- `backend/results/__init__.py`
- `backend/results/apps.py`
- `backend/results/models.py` — GameResult
- `backend/results/views.py`
- `backend/results/urls.py`
- `backend/results/tests.py`

### Modified backend files
- `backend/requirements.txt`
- `backend/typewriter_api/settings.py`
- `backend/typewriter_api/urls.py`

### New frontend files
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/context/AuthProvider.tsx`
- `frontend/src/hooks/useProfile.ts`
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/components/auth/ProfileView.tsx`
- `frontend/src/components/auth/AuthModal.tsx`
- `frontend/src/components/DatePicker.tsx`
- `frontend/src/lib/utils.ts` (shadcn init creates this)
- `frontend/src/components/ui/calendar.tsx` (shadcn add creates this)
- `frontend/src/components/ui/popover.tsx` (shadcn add creates this)

### Modified frontend files
- `frontend/vite.config.ts` — add `@` alias for shadcn
- `frontend/src/App.tsx`
- `frontend/src/components/Header.tsx`
- `frontend/src/components/TypewriterGame.tsx`
- `frontend/src/hooks/useNews.ts`
- `frontend/src/context/GameProvider.tsx`

---

## Task 1: Install SimpleJWT and configure backend

**Files:**
- Modify: `backend/requirements.txt`
- Modify: `backend/typewriter_api/settings.py`
- Create: `backend/accounts/__init__.py`
- Create: `backend/accounts/authentication.py`

- [ ] **Step 1: Add SimpleJWT to requirements.txt**

In `backend/requirements.txt`, add on a new line after `djangorestframework==3.16.1`:
```
djangorestframework-simplejwt==5.5.0
```

- [ ] **Step 2: Install the dependency**

```bash
cd backend && pip install djangorestframework-simplejwt==5.5.0
```

Expected output ends with: `Successfully installed djangorestframework-simplejwt-5.5.0`

- [ ] **Step 3: Create accounts package files**

Create `backend/accounts/__init__.py` — empty file.

Create `backend/accounts/authentication.py`:
```python
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
```

- [ ] **Step 4: Update settings.py — add imports**

At the top of `backend/typewriter_api/settings.py`, after `import os`, add:
```python
from datetime import timedelta
```

- [ ] **Step 5: Update settings.py — add accounts to INSTALLED_APPS**

In `backend/typewriter_api/settings.py`, change:
```python
    'rest_framework',
    'news',
```
to:
```python
    'rest_framework',
    'accounts',
    'news',
```

- [ ] **Step 6: Update settings.py — add REST_FRAMEWORK and SIMPLE_JWT blocks**

After the `INSTALLED_APPS` block, add:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.CookieJWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

- [ ] **Step 7: Update settings.py — fix CORS for credentials**

Replace the line:
```python
CORS_ALLOW_ALL_ORIGINS = True
```
with:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.*\.vercel\.app$',
]
if os.environ.get('CORS_ALLOWED_ORIGINS_EXTRA'):
    CORS_ALLOWED_ORIGINS.extend(
        os.environ.get('CORS_ALLOWED_ORIGINS_EXTRA').split(',')
    )
CORS_ALLOW_CREDENTIALS = True
```

- [ ] **Step 8: Commit**

```bash
git add backend/requirements.txt backend/typewriter_api/settings.py \
        backend/accounts/__init__.py backend/accounts/authentication.py
git commit -m "chore: install SimpleJWT and configure cookie-based JWT auth"
```

---

## Task 2: Create accounts app — register + login

**Files:**
- Create: `backend/accounts/apps.py`
- Create: `backend/accounts/serializers.py`
- Create: `backend/accounts/views.py`
- Create: `backend/accounts/urls.py`
- Create: `backend/accounts/tests.py`
- Modify: `backend/typewriter_api/urls.py`

- [ ] **Step 1: Write the failing tests for register and login**

Create `backend/accounts/tests.py`:
```python
from django.contrib.auth.models import User
from rest_framework.test import APITestCase


class RegisterTests(APITestCase):
    def test_register_creates_user_and_sets_cookies(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertIn('id', response.data)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_duplicate_username_returns_400(self):
        User.objects.create_user(username='existing', password='pass')
        response = self.client.post('/api/auth/register/', {
            'username': 'existing',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_register_short_password_returns_400(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'short',
        }, format='json')
        self.assertEqual(response.status_code, 400)


class LoginTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username='testuser', password='testpass123')

    def test_login_valid_credentials_sets_cookies(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_login_invalid_credentials_returns_401(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrongpass',
        }, format='json')
        self.assertEqual(response.status_code, 401)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend && python manage.py test accounts
```

Expected: `ModuleNotFoundError` or `ImportError` — the app doesn't exist yet.

- [ ] **Step 3: Create apps.py**

Create `backend/accounts/apps.py`:
```python
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
```

- [ ] **Step 4: Create serializers.py**

Create `backend/accounts/serializers.py`:
```python
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
```

- [ ] **Step 5: Create views.py with register and login**

Create `backend/accounts/views.py`:
```python
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

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
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
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
        except Exception:
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
```

- [ ] **Step 6: Create urls.py**

Create `backend/accounts/urls.py`:
```python
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, RefreshView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('refresh/', RefreshView.as_view(), name='auth-refresh'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
]
```

- [ ] **Step 7: Wire into root urls.py**

In `backend/typewriter_api/urls.py`, add to `urlpatterns`:
```python
path('api/auth/', include('accounts.urls')),
```

The full `urlpatterns` list should be:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('news.urls')),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
```

- [ ] **Step 8: Run tests — register and login should pass**

```bash
cd backend && python manage.py test accounts
```

Expected: `Ran 5 tests in X.XXXs` — `OK` (logout/refresh/profile tests not yet written, but the 5 tests we wrote pass).

- [ ] **Step 9: Commit**

```bash
git add backend/accounts/
git commit -m "feat: add accounts app with register and login endpoints"
```

---

## Task 3: Add logout, refresh, and profile tests

**Files:**
- Modify: `backend/accounts/tests.py`

The views for logout, refresh, and profile are already implemented in Task 2. This task adds tests to verify them.

- [ ] **Step 1: Extend tests.py with logout, refresh, and profile tests**

Append to `backend/accounts/tests.py`:
```python
class LogoutTests(APITestCase):
    def setUp(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        login_response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.client.cookies = login_response.cookies

    def test_logout_clears_cookies(self):
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.cookies['access_token'].value, '')
        self.assertEqual(response.cookies['refresh_token'].value, '')


class RefreshTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username='testuser', password='testpass123')
        login_response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.client.cookies = login_response.cookies

    def test_refresh_with_valid_cookie_returns_user(self):
        response = self.client.post('/api/auth/refresh/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertIn('access_token', response.cookies)

    def test_refresh_without_cookie_returns_401(self):
        self.client.cookies.clear()
        response = self.client.post('/api/auth/refresh/')
        self.assertEqual(response.status_code, 401)


class ProfileTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username='testuser', password='testpass123')
        login_response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.client.cookies = login_response.cookies

    def test_profile_returns_stats_for_authenticated_user(self):
        response = self.client.get('/api/auth/profile/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['best_wpm'], 0)
        self.assertEqual(response.data['avg_accuracy'], 0)
        self.assertEqual(response.data['total_games'], 0)

    def test_profile_returns_401_when_not_authenticated(self):
        self.client.cookies.clear()
        response = self.client.get('/api/auth/profile/')
        self.assertEqual(response.status_code, 401)
```

- [ ] **Step 2: Run all accounts tests**

```bash
cd backend && python manage.py test accounts
```

Expected: `Ran 10 tests in X.XXXs` — `OK`

- [ ] **Step 3: Commit**

```bash
git add backend/accounts/tests.py
git commit -m "test: add logout, refresh, and profile tests for accounts app"
```

---

## Task 4: Create results app

**Files:**
- Create: `backend/results/__init__.py`
- Create: `backend/results/apps.py`
- Create: `backend/results/models.py`
- Create: `backend/results/views.py`
- Create: `backend/results/urls.py`
- Create: `backend/results/tests.py`
- Modify: `backend/typewriter_api/settings.py`
- Modify: `backend/typewriter_api/urls.py`

- [ ] **Step 1: Write failing tests**

Create `backend/results/tests.py`:
```python
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from news.models import News
from datetime import date


class SaveResultTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='player', password='pass123')
        self.news = News.objects.create(
            title='Test Article',
            content='some content here',
            author='Author',
            source='Source',
            date=date.today(),
        )
        login_response = self.client.post('/api/auth/login/', {
            'username': 'player',
            'password': 'pass123',
        }, format='json')
        self.client.cookies = login_response.cookies

    def test_save_result_requires_auth(self):
        self.client.cookies.clear()
        response = self.client.post('/api/results/', {
            'news_id': self.news.id,
            'wpm': 60,
            'accuracy': 95,
        }, format='json')
        self.assertEqual(response.status_code, 401)

    def test_save_result_creates_game_result(self):
        response = self.client.post('/api/results/', {
            'news_id': self.news.id,
            'wpm': 60,
            'accuracy': 95,
        }, format='json')
        self.assertEqual(response.status_code, 200)
        from results.models import GameResult
        result = GameResult.objects.get(user=self.user, news=self.news)
        self.assertEqual(result.wpm, 60)
        self.assertEqual(result.accuracy, 95)

    def test_save_result_upserts_on_replay(self):
        self.client.post('/api/results/', {
            'news_id': self.news.id,
            'wpm': 60,
            'accuracy': 95,
        }, format='json')
        self.client.post('/api/results/', {
            'news_id': self.news.id,
            'wpm': 80,
            'accuracy': 98,
        }, format='json')
        from results.models import GameResult
        self.assertEqual(GameResult.objects.filter(user=self.user, news=self.news).count(), 1)
        result = GameResult.objects.get(user=self.user, news=self.news)
        self.assertEqual(result.wpm, 80)

    def test_save_result_invalid_news_returns_404(self):
        response = self.client.post('/api/results/', {
            'news_id': 99999,
            'wpm': 60,
            'accuracy': 95,
        }, format='json')
        self.assertEqual(response.status_code, 404)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd backend && python manage.py test results
```

Expected: `ModuleNotFoundError` — the app doesn't exist yet.

- [ ] **Step 3: Create the results app files**

Create `backend/results/__init__.py` — empty file.

Create `backend/results/apps.py`:
```python
from django.apps import AppConfig


class ResultsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'results'
```

Create `backend/results/models.py`:
```python
from django.db import models
from django.contrib.auth.models import User
from news.models import News


class GameResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='results')
    wpm = models.IntegerField()
    accuracy = models.IntegerField()
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'news')

    def __str__(self):
        return f"{self.user.username} — {self.news.title} — {self.wpm} WPM"
```

Create `backend/results/views.py`:
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from news.models import News
from .models import GameResult


class SaveResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        news_id = request.data.get('news_id')
        wpm = request.data.get('wpm')
        accuracy = request.data.get('accuracy')

        if news_id is None or wpm is None or accuracy is None:
            return Response(
                {'error': 'news_id, wpm, and accuracy are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response({'error': 'News not found'}, status=status.HTTP_404_NOT_FOUND)

        GameResult.objects.update_or_create(
            user=request.user,
            news=news,
            defaults={'wpm': wpm, 'accuracy': accuracy},
        )
        return Response({'message': 'Result saved'})
```

Create `backend/results/urls.py`:
```python
from django.urls import path
from .views import SaveResultView

urlpatterns = [
    path('', SaveResultView.as_view(), name='save-result'),
]
```

- [ ] **Step 4: Add results to INSTALLED_APPS**

In `backend/typewriter_api/settings.py`, change:
```python
    'accounts',
    'news',
```
to:
```python
    'accounts',
    'results',
    'news',
```

- [ ] **Step 5: Wire results into root urls.py**

In `backend/typewriter_api/urls.py`, add:
```python
path('api/results/', include('results.urls')),
```

So `urlpatterns` becomes:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/results/', include('results.urls')),
    path('api/', include('news.urls')),
    ...
]
```

- [ ] **Step 6: Create and run the migration**

```bash
cd backend && python manage.py makemigrations results
python manage.py migrate
```

Expected: `Created model GameResult` then `Applying results.0001_initial... OK`

- [ ] **Step 7: Run all tests**

```bash
cd backend && python manage.py test accounts results
```

Expected: `Ran 14 tests in X.XXXs` — `OK`

- [ ] **Step 8: Commit**

```bash
git add backend/results/ backend/typewriter_api/settings.py backend/typewriter_api/urls.py
git commit -m "feat: add results app with GameResult model and save endpoint"
```

---

## Task 5: Add AuthContext and AuthProvider to frontend

**Files:**
- Create: `frontend/src/context/AuthContext.tsx`
- Create: `frontend/src/context/AuthProvider.tsx`
- Modify: `frontend/src/main.tsx`

- [ ] **Step 1: Create AuthContext.tsx**

Create `frontend/src/context/AuthContext.tsx`:
```tsx
import { createContext, useContext } from "react";

export type AuthUser = { id: string; username: string };

export type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

- [ ] **Step 2: Create AuthProvider.tsx**

Create `frontend/src/context/AuthProvider.tsx`:
```tsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext, AuthUser } from "./AuthContext";

const STORAGE_KEY = "typewriter_user";

const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl ?? "https://typewriter-api-production.up.railway.app";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) return;
    fetch(`${getBaseUrl()}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json() as Promise<AuthUser>;
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/api/auth/login/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error((err as { error?: string }).error ?? "Login failed");
    }
    const data = (await res.json()) as AuthUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/api/auth/register/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      const errData = err as { username?: string[]; error?: string };
      throw new Error(errData.username?.[0] ?? errData.error ?? "Registration failed");
    }
    const data = (await res.json()) as AuthUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${getBaseUrl()}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

- [ ] **Step 3: Wrap the app with AuthProvider in main.tsx**

In `frontend/src/main.tsx`, import AuthProvider and wrap the tree:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@context/AuthProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
```

- [ ] **Step 4: Verify it type-checks**

```bash
cd frontend && npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/context/AuthContext.tsx frontend/src/context/AuthProvider.tsx frontend/src/main.tsx
git commit -m "feat: add AuthContext and AuthProvider with JWT cookie session management"
```

---

## Task 6: Build auth modal components

**Files:**
- Create: `frontend/src/hooks/useProfile.ts`
- Create: `frontend/src/components/auth/LoginForm.tsx`
- Create: `frontend/src/components/auth/RegisterForm.tsx`
- Create: `frontend/src/components/auth/ProfileView.tsx`
- Create: `frontend/src/components/auth/AuthModal.tsx`

- [ ] **Step 1: Create useProfile.ts**

Create `frontend/src/hooks/useProfile.ts`:
```ts
import { useQuery } from "@tanstack/react-query";

export type Profile = {
  id: string;
  username: string;
  best_wpm: number;
  avg_accuracy: number;
  total_games: number;
};

const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl ?? "https://typewriter-api-production.up.railway.app";
};

export const useProfile = (enabled: boolean) => {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${getBaseUrl()}/api/auth/profile/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<Profile>;
    },
    enabled,
  });
};
```

- [ ] **Step 2: Create LoginForm.tsx**

Create `frontend/src/components/auth/LoginForm.tsx`:
```tsx
import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import NeoButton from "@components/common/NeoButton";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-old-english text-2xl">Sign In</h2>
      {error && (
        <p className="font-sans text-sm text-press-red">{error}</p>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <NeoButton type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </NeoButton>
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="font-sans text-sm underline"
      >
        No account? Register
      </button>
    </form>
  );
};
```

- [ ] **Step 3: Create RegisterForm.tsx**

Create `frontend/src/components/auth/RegisterForm.tsx`:
```tsx
import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import NeoButton from "@components/common/NeoButton";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(username, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-old-english text-2xl">Create Account</h2>
      {error && (
        <p className="font-sans text-sm text-press-red">{error}</p>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <input
        type="password"
        placeholder="Password (min. 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <NeoButton type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </NeoButton>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="font-sans text-sm underline"
      >
        Already have an account? Sign in
      </button>
    </form>
  );
};
```

- [ ] **Step 4: Create ProfileView.tsx**

Create `frontend/src/components/auth/ProfileView.tsx`:
```tsx
import React from "react";
import { useAuth } from "@context/AuthContext";
import { useProfile } from "@hooks/useProfile";
import NeoButton from "@components/common/NeoButton";
import StatItem from "@components/common/StatItem";

interface ProfileViewProps {
  onClose: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, isError } = useProfile(true);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-old-english text-2xl">{user?.username}</h2>
      {isLoading && (
        <p className="font-sans text-sm text-attribution">Loading stats…</p>
      )}
      {isError && (
        <p className="font-sans text-sm text-press-red">
          Could not load profile.
        </p>
      )}
      {profile && (
        <div className="grid grid-cols-3 gap-4">
          <StatItem label="Best WPM" value={profile.best_wpm} />
          <StatItem label="Avg Accuracy" value={`${profile.avg_accuracy}%`} />
          <StatItem label="Games" value={profile.total_games} />
        </div>
      )}
      <NeoButton variant="secondary" onClick={handleLogout}>
        Sign Out
      </NeoButton>
    </div>
  );
};
```

- [ ] **Step 5: Check StatItem component signature**

Read `frontend/src/components/common/StatItem.tsx` to confirm it accepts `label` and `value` props. If the props are named differently, adjust `ProfileView.tsx` accordingly.

- [ ] **Step 6: Create AuthModal.tsx**

Create `frontend/src/components/auth/AuthModal.tsx`:
```tsx
import React, { useState } from "react";
import Modal from "@components/common/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ProfileView } from "./ProfileView";
import { useAuth } from "@context/AuthContext";

interface AuthModalProps {
  onClose: () => void;
}

type GuestView = "login" | "register";

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [guestView, setGuestView] = useState<GuestView>("login");

  return (
    <Modal className="w-full max-w-sm" onClickOverlay={onClose}>
      {user ? (
        <ProfileView onClose={onClose} />
      ) : guestView === "login" ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToRegister={() => setGuestView("register")}
        />
      ) : (
        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={() => setGuestView("login")}
        />
      )}
    </Modal>
  );
};
```

- [ ] **Step 7: Type-check**

```bash
cd frontend && npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/hooks/useProfile.ts frontend/src/components/auth/
git commit -m "feat: add auth modal with login, register, and profile views"
```

---

## Task 7: Wire Header username to AuthModal

**Files:**
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Rewrite Header.tsx**

Replace the full contents of `frontend/src/components/Header.tsx`:
```tsx
import React, { useState } from "react";
import { useGameState } from "@context/GameContext";
import { useAuth } from "@context/AuthContext";
import { AuthModal } from "@components/auth/AuthModal";

const HeaderTitle: React.FC = React.memo(() => (
  <h1 className="border-b border-ink pb-4 text-center font-old-english text-5xl">
    The Typewriter Times
  </h1>
));

const Stats: React.FC = React.memo(() => {
  const { wpm, accuracy } = useGameState();
  return (
    <p className="w-48 text-right tabular-nums">
      {wpm} WPM · {accuracy}%
    </p>
  );
});

const HeaderMeta: React.FC<{
  date: string;
  onUsernameClick: () => void;
}> = React.memo(({ date, onUsernameClick }) => {
  const { user } = useAuth();
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-ink font-sans text-sm">
      <button
        onClick={onUsernameClick}
        className="w-48 text-left hover:underline"
      >
        {user?.username ?? "Guest"}
      </button>
      <p className="uppercase">{formattedDate}</p>
      <Stats />
    </div>
  );
});

const Header: React.FC<{ date: string }> = React.memo(({ date }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="mb-6">
      <HeaderTitle />
      <HeaderMeta date={date} onUsernameClick={() => setModalOpen(true)} />
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </header>
  );
});

export default Header;
```

- [ ] **Step 2: Start dev server and verify the modal works**

```bash
cd /path/to/repo && npm run dev
```

Open `http://localhost:5173`. Click "Guest" in the header — the login/register modal should appear. Register an account, confirm the modal switches to the profile view with zero stats.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "feat: wire header username to auth modal"
```

---

## Task 8: Set up shadcn Calendar + Popover and build DatePicker

**Files:**
- Modify: `frontend/vite.config.ts`
- Create: `frontend/src/lib/utils.ts`
- Create: `frontend/src/components/ui/calendar.tsx` (via shadcn)
- Create: `frontend/src/components/ui/popover.tsx` (via shadcn)
- Create: `frontend/src/components/DatePicker.tsx`

- [ ] **Step 1: Add `@` alias to vite.config.ts**

In `frontend/vite.config.ts`, add `"@": path.resolve(__dirname, "./src")` to the alias map:
```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@mocks": path.resolve(__dirname, "./src/mocks"),
      "@reducers": path.resolve(__dirname, "./src/reducers"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@app-types": path.resolve(__dirname, "./src/types"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
```

- [ ] **Step 2: Create src/lib/utils.ts**

Create `frontend/src/lib/utils.ts`:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Run shadcn init**

```bash
cd frontend && npx shadcn@latest init -d
```

When prompted, answer:
- Style: **Default**
- Base color: **Neutral**
- `globals.css` location: `src/index.css`
- CSS variables: **Yes**
- `components.json` path: accept default

This creates `components.json` and updates `src/index.css` with CSS variable definitions.

- [ ] **Step 4: Add Calendar and Popover components**

```bash
cd frontend && npx shadcn@latest add calendar popover --yes
```

Expected: creates `src/components/ui/calendar.tsx` and `src/components/ui/popover.tsx`, installs `react-day-picker` and `@radix-ui/react-popover` and `date-fns`.

- [ ] **Step 5: Create DatePicker.tsx**

Create `frontend/src/components/DatePicker.tsx`:
```tsx
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  newsDate: string;
  onSelect: (date: string | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  newsDate,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const parsed = parseISO(newsDate);
  const formattedDisplay = new Date(newsDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const handleSelect = (date: Date | undefined) => {
    setOpen(false);
    if (!date) {
      onSelect(undefined);
      return;
    }
    onSelect(format(date, "MM-dd-yyyy"));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="uppercase hover:underline cursor-pointer">
          {formattedDisplay}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-ink bg-paper" align="center">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={handleSelect}
          disabled={(d) => d > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
```

- [ ] **Step 6: Type-check**

```bash
cd frontend && npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/vite.config.ts frontend/src/lib/ frontend/src/components/ui/ \
        frontend/src/components/DatePicker.tsx frontend/components.json \
        frontend/package.json frontend/package-lock.json
git commit -m "feat: add shadcn Calendar + Popover and DatePicker component"
```

---

## Task 9: Update useNews with date param and wire App.tsx

**Files:**
- Modify: `frontend/src/hooks/useNews.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/Header.tsx`
- Modify: `frontend/src/components/TypewriterGame.tsx`

- [ ] **Step 1: Update useNews to accept an optional date**

Replace `frontend/src/hooks/useNews.ts`:
```ts
import { useQuery } from "@tanstack/react-query";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { News } from "@app-types";

const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl ?? "https://typewriter-api-production.up.railway.app";
};

export const useNews = (date?: string) => {
  return useQuery<News>({
    queryKey: ["news", date ?? "today"],
    queryFn: async () => {
      const baseUrl = getBaseUrl();
      if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
        return NEWS_CONTENT_MOCK;
      }
      const url = date
        ? `${baseUrl}/api/news/${date}/`
        : `${baseUrl}/api/news/`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      if (data && data.length > 0) return data[0];
      if (date) throw new Error("No article for this date");
      return NEWS_CONTENT_MOCK;
    },
    retry: date ? 0 : 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

- [ ] **Step 2: Add selectedDate state to App.tsx**

Replace `frontend/src/App.tsx`:
```tsx
"use client";

import { useState } from "react";
import TypewriterGame from "@components/TypewriterGame";
import Footer from "@components/Footer";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TypewriterGame
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Update TypewriterGame to accept selectedDate and onDateSelect**

Replace `frontend/src/components/TypewriterGame.tsx`:
```tsx
import React, { useCallback } from "react";
import NewsContent from "./NewsContent";
import Header from "./Header";
import NewsHeader from "./NewsHeader";
import GameCompletion from "./GameCompletion";
import Toast from "./common/Toast";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { GameProvider } from "@context/GameProvider";
import { useGameDispatch, useGameState } from "@context/GameContext";
import { News } from "@app-types";
import Loading from "./Loading";
import { useNews } from "@hooks/useNews";

interface GameLayoutProps {
  news: News;
  onDateSelect: (date: string | undefined) => void;
}

const GameLayout: React.FC<GameLayoutProps> = ({ news, onDateSelect }) => {
  const dispatch = useGameDispatch();

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "SUBMIT_WORD" });
      } else if (e.key === "Backspace") {
        dispatch({ type: "DELETE_LETTER" });
      } else if (e.key.length === 1) {
        dispatch({ type: "TYPE_LETTER", letter: e.key });
      }
    },
    [dispatch],
  );

  const state = useGameState();
  const isGameFinished = state.currentWordIndex >= state.wordsList.length;

  return (
    <article className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col overflow-hidden px-12 pt-6">
      <Header date={news.date} onDateSelect={onDateSelect} />
      <NewsHeader news={news} />
      <NewsContent handleOnKeyDown={handleOnKeyDown} />
      {state.showAfkToast && (
        <Toast
          title="AFK Detected"
          description="WPM has been readjusted to your last active typing speed."
          onDismiss={() => dispatch({ type: "DISMISS_AFK_TOAST" })}
        />
      )}
      {isGameFinished && (
        <GameCompletion
          wpm={state.wpm}
          accuracy={state.accuracy}
          totalErrors={state.totalErrors}
          newsTitle={news.title}
          onRestart={() => window.location.reload()}
        />
      )}
    </article>
  );
};

interface TypewriterGameProps {
  selectedDate: string | undefined;
  onDateSelect: (date: string | undefined) => void;
}

const TypewriterGame: React.FC<TypewriterGameProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const { data: news, isLoading, isError, error } = useNews(selectedDate);

  if (isLoading || !news) return <Loading />;

  if (isError) {
    const msg = error instanceof Error ? error.message : "";
    if (selectedDate && msg === "No article for this date") {
      return (
        <div className="flex flex-1 items-center justify-center font-sans text-attribution">
          No article available for this date.
        </div>
      );
    }
    return (
      <GameProvider news={NEWS_CONTENT_MOCK}>
        <GameLayout news={NEWS_CONTENT_MOCK} onDateSelect={onDateSelect} />
      </GameProvider>
    );
  }

  return (
    <GameProvider news={news}>
      <GameLayout news={news} onDateSelect={onDateSelect} />
    </GameProvider>
  );
};

export default TypewriterGame;
```

- [ ] **Step 4: Update Header to render DatePicker instead of plain date text**

In `frontend/src/components/Header.tsx`, update the `HeaderMeta` component and its props to include `onDateSelect`:

Replace the `HeaderMeta` component and the `Header` component:
```tsx
import React, { useState } from "react";
import { useGameState } from "@context/GameContext";
import { useAuth } from "@context/AuthContext";
import { AuthModal } from "@components/auth/AuthModal";
import { DatePicker } from "@components/DatePicker";

const HeaderTitle: React.FC = React.memo(() => (
  <h1 className="border-b border-ink pb-4 text-center font-old-english text-5xl">
    The Typewriter Times
  </h1>
));

const Stats: React.FC = React.memo(() => {
  const { wpm, accuracy } = useGameState();
  return (
    <p className="w-48 text-right tabular-nums">
      {wpm} WPM · {accuracy}%
    </p>
  );
});

const HeaderMeta: React.FC<{
  date: string;
  onUsernameClick: () => void;
  onDateSelect: (date: string | undefined) => void;
}> = React.memo(({ date, onUsernameClick, onDateSelect }) => {
  const { user } = useAuth();

  return (
    <div className="mt-1 flex flex-row items-center justify-between border-b-2 border-ink font-sans text-sm">
      <button
        onClick={onUsernameClick}
        className="w-48 text-left hover:underline"
      >
        {user?.username ?? "Guest"}
      </button>
      <DatePicker newsDate={date} onSelect={onDateSelect} />
      <Stats />
    </div>
  );
});

const Header: React.FC<{
  date: string;
  onDateSelect: (date: string | undefined) => void;
}> = React.memo(({ date, onDateSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="mb-6">
      <HeaderTitle />
      <HeaderMeta
        date={date}
        onUsernameClick={() => setModalOpen(true)}
        onDateSelect={onDateSelect}
      />
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </header>
  );
});

export default Header;
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Click the date in the header — a calendar should pop up. Select a past date — the article for that date should load (or "No article available" if none exists). Verify today's article still loads by default.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/hooks/useNews.ts frontend/src/App.tsx \
        frontend/src/components/Header.tsx frontend/src/components/TypewriterGame.tsx
git commit -m "feat: add date navigation with shadcn Calendar in header"
```

---

## Task 10: Sync game result on completion

**Files:**
- Modify: `frontend/src/context/GameProvider.tsx`

- [ ] **Step 1: Update GameProvider to sync result on game completion**

Replace `frontend/src/context/GameProvider.tsx`:
```tsx
import React, { useEffect, useReducer, useRef } from "react";
import { typingReducer } from "@reducers/TypingReducer";
import { News, TypingState } from "@app-types";
import { GameDispatchContext, GameStateContext } from "./GameContext";
import { useAuth } from "./AuthContext";

const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl ?? "https://typewriter-api-production.up.railway.app";
};

export const GameProvider: React.FC<{
  children: React.ReactNode;
  news: News;
}> = ({ children, news }) => {
  const wordsList = news.content.split(/\s+/);
  const STORAGE_KEY = "typewriter_game_state";
  const { user } = useAuth();

  const loadSavedState = (): TypingState | undefined => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.newsId === news.id) {
          return {
            ...parsed.state,
            wpmHistory: parsed.state.wpmHistory ?? [],
            isAfk: parsed.state.isAfk ?? false,
            showAfkToast: parsed.state.showAfkToast ?? false,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
    return undefined;
  };

  const initialState: TypingState = loadSavedState() || {
    currentWordIndex: 0,
    typedWord: "",
    wordsList: wordsList,
    activeTime: 0,
    lastKeystrokeTime: null,
    wpm: 0,
    wpmHistory: [],
    isAfk: false,
    showAfkToast: false,
    totalCharsTyped: 0,
    totalErrors: 0,
    accuracy: 100,
  };

  const [state, dispatch] = useReducer(typingReducer, initialState);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const hasStarted = state.lastKeystrokeTime !== null;
  const isGameFinished = state.currentWordIndex >= state.wordsList.length;

  useEffect(() => {
    if (!hasStarted || isGameFinished) return;
    const intervalId = setInterval(() => {
      dispatch({ type: "UPDATE_WPM" });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [hasStarted, isGameFinished]);

  useEffect(() => {
    if (!isGameFinished) return;
    localStorage.removeItem(STORAGE_KEY);
    if (!user) return;
    fetch(`${getBaseUrl()}/api/results/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        news_id: news.id,
        wpm: state.wpm,
        accuracy: state.accuracy,
      }),
    }).catch(() => {
      // best-effort — silently ignore failures
    });
  }, [isGameFinished]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentState = stateRef.current;
      const finished =
        currentState.currentWordIndex >= currentState.wordsList.length;
      const started =
        currentState.currentWordIndex > 0 || currentState.typedWord.length > 0;
      if (!finished && started) {
        e.preventDefault();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ newsId: news.id, state: currentState }),
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [news.id]);

  return (
    <GameDispatchContext.Provider value={dispatch}>
      <GameStateContext.Provider value={state}>
        {children}
      </GameStateContext.Provider>
    </GameDispatchContext.Provider>
  );
};
```

- [ ] **Step 2: Verify result sync in browser**

```bash
npm run dev
```

Log in, play a full article, finish the game. Open DevTools → Network — confirm a `POST /api/results/` request was fired with `news_id`, `wpm`, and `accuracy`. Open the profile modal — `total_games` should now be 1 and `best_wpm` should reflect your result.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/context/GameProvider.tsx
git commit -m "feat: sync game result to backend on completion when logged in"
```

---

## Self-review checklist

- [x] Register/login/logout/refresh/profile — all covered in Tasks 1–3
- [x] GameResult model + save endpoint — Task 4
- [x] CORS credentials (`CORS_ALLOW_CREDENTIALS`, `SameSite`) — Task 1 settings
- [x] AuthProvider + session restoration — Task 5
- [x] AuthModal (login/register/profile) — Tasks 6–7
- [x] Date picker (shadcn Calendar + Popover) — Tasks 8–9
- [x] useNews date param + selectedDate in App — Task 9
- [x] "No article for this date" error state — Task 9 TypewriterGame
- [x] Game result sync (best-effort) — Task 10
- [x] Profile stats (best WPM, avg accuracy, total games) — Task 4 ProfileView + accounts views
