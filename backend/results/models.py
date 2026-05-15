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
