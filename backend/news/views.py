from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import News
from .serializers import NewsSerializer
from .services import GeminiService
from django.conf import settings
from datetime import date

class GenerateNewsView(APIView):
    """
    View to trigger the generation of a new satirical news article.
    """
    def post(self, request):
        """
        Generates a new news article using Gemini AI.
        Requires a valid Bearer token matching CRON_SECRET.
        """
        auth_header = request.headers.get('Authorization')
        if auth_header != f'Bearer {settings.CRON_SECRET}':
            return Response(
                {"error": "Unauthorized"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if News.objects.filter(date=timezone.localdate()).exists():
            return Response({"message": "News already exists for today"})

        service = GeminiService()
        data = service.generate_news()

        if data:
            News.objects.create(
                title=data['title'],
                content=data['content'],
                author=data['author'],
                source=data['source'],
                date=timezone.localdate()
            )
            return Response({"message": "News generated successfully", "data": data})
        
        return Response(
            {"error": "Failed to generate news"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing news articles.
    Provides standard read-only actions.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer

class NewsByDateView(APIView):
    """
    View to retrieve news articles by a specific date.
    """
    def get(self, request, date=None):
        """
        Get news for a specific date or today if no date is provided.
        Date format: MM-DD-YYYY
        """
        if date:
            try:
                # Format: MM-DD-YYYY
                query_date = datetime.strptime(date, '%m-%d-%Y').date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use MM-DD-YYYY."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            query_date = timezone.localdate()

        news_items = News.objects.filter(date=query_date)
        serializer = NewsSerializer(news_items, many=True)
        return Response(serializer.data)
