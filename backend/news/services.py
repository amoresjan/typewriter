import os
import json
import google.generativeai as genai
from django.conf import settings
from datetime import date

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_news(self):
        prompt = """
        Generate a satirical, funny, and lighthearted news article.
        The tone should be like "The Onion" or "The Daily Glitch".
        Avoid political, religious, or sensitive topics.
        The output must be a valid JSON object with the following keys:
        - title: The headline of the article.
        - content: The body of the article (use \\n for newlines). Avoid using any characters that are hard to type on a keyboard like emdash (—). Make 350-400 words per article.
        - author: A fictional author name.
        - source: A fictional news source name (e.g., "The Daily Glitch").
        
        Example JSON format:
        {
            "title": "Man Yells at Cloud",
            "content": "Old man yells at cloud...",
            "author": "Abe Simpson",
            "source": "Springfield Shopper"
        }
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            # Clean up potential markdown code blocks
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            data = json.loads(text)
            return data
        except Exception as e:
            print(f"Error generating news: {e}")
            return None
