from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.ModelSerializer):
    """
    Serializer for the News model.
    """
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'author', 'source', 'date']
