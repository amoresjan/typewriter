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
