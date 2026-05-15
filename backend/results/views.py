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
