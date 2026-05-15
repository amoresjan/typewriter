from django.core.management.base import BaseCommand
from news.services import GeminiService
from news.models import News
from django.utils import timezone

class Command(BaseCommand):
    help = 'Generates a new satirical news article using Gemini API'

    def handle(self, *args, **kwargs):
        self.stdout.write("Generating news...")
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
            self.stdout.write(self.style.SUCCESS(f"Successfully created news: {data['title']}"))
        else:
            self.stdout.write(self.style.ERROR("Failed to generate news"))
