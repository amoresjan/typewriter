from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import News
from datetime import date

class NewsModelTest(TestCase):
    def test_create_news(self):
        news = News.objects.create(
            title="Test News",
            content="Test Content",
            author="Test Author",
            source="Test Source",
            date=date.today()
        )
        self.assertEqual(news.title, "Test News")
        self.assertEqual(str(news), "Test News")

class NewsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.news = News.objects.create(
            title="API News",
            content="API Content",
            author="API Author",
            source="API Source",
            date=date.today()
        )

    def test_get_news_list(self):
        response = self.client.get('/api/news/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Note: The new view filters by today, so if the setup created news for today, it returns 1.
        # If the setup created news for another day, it might return 0.
        # But NewsAPITest.setUp uses date.today().
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "API News")

class NewsByDateAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.today = timezone.localdate()
        self.yesterday = self.today - timezone.timedelta(days=1)
        
        News.objects.create(title="Today News", content="C", author="A", source="S", date=self.today)
        News.objects.create(title="Yesterday News", content="C", author="A", source="S", date=self.yesterday)

    def test_get_news_today(self):
        response = self.client.get('/api/news/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return today's news
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Today News")

    def test_get_news_by_date(self):
        date_str = self.yesterday.strftime('%m-%d-%Y')
        response = self.client.get(f'/api/news/{date_str}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Yesterday News")

    def test_get_news_invalid_date(self):
        response = self.client.get('/api/news/invalid-date/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

from unittest.mock import patch

class GenerateNewsViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('news-generate')
        self.cron_secret = 'test_secret'

    @patch('news.views.GeminiService')
    def test_generate_news_success(self, MockGeminiService):
        # Setup mock
        mock_service = MockGeminiService.return_value
        mock_service.generate_news.return_value = {
            "title": "Generated News",
            "content": "Content",
            "author": "Author",
            "source": "Source"
        }
        
        # Override settings
        with self.settings(CRON_SECRET=self.cron_secret):
            # Note: HTTP_AUTHORIZATION header is passed as is to META, 
            # but Django's test client might expect it differently or headers kwarg.
            # Using extra headers in post.
            response = self.client.post(
                self.url, 
                headers={'Authorization': f'Bearer {self.cron_secret}'}
            )
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(News.objects.count(), 1)
        self.assertEqual(News.objects.first().title, "Generated News")

    def test_generate_news_unauthorized(self):
        with self.settings(CRON_SECRET='secret'):
            response = self.client.post(
                self.url, 
                headers={'Authorization': 'Bearer wrong_secret'}
            )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_generate_news_already_exists(self):
        News.objects.create(
            title="Existing News",
            content="Content",
            author="Author",
            source="Source",
            date=date.today()
        )
        
        with self.settings(CRON_SECRET='secret'):
            response = self.client.post(
                self.url, 
                headers={'Authorization': 'Bearer secret'}
            )
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "News already exists for today")
        # Should still be 1
        self.assertEqual(News.objects.count(), 1)
