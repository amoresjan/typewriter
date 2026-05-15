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
