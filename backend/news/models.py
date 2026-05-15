from django.db import models

class News(models.Model):
    """
    Model representing a generated satirical news article.
    """
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date', '-created_at']
