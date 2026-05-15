# Typewriter API

The backend service for the Typewriter application. This API generates satirical, funny news content using Google's Gemini AI and serves it to the frontend for typing tests.

## Tech Stack

- **Framework**: Django & Django Rest Framework (DRF)
- **AI Model**: Google Gemini Pro
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **Deployment**: Railway
- **Containerization**: Docker

## Prerequisites

- Python 3.10+
- A Google Gemini API Key

## Local Development Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd typewriter-api
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root directory:

    ```bash
    touch .env
    ```

    Add the following variables:

    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    SECRET_KEY=your_django_secret_key
    DEBUG=True
    ```

5.  **Run migrations:**

    ```bash
    python manage.py migrate
    ```

6.  **Generate initial news content:**

    ```bash
    python manage.py generate_news
    ```

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://localhost:8000/api/news/`.

## Docker Setup

You can also run the application using Docker.

1.  **Build the image:**

    ```bash
    docker build -t typewriter-api .
    ```

2.  **Run the container:**
    ```bash
    docker run -p 8000:8000 --env-file .env typewriter-api
    ```

## Deployment on Railway

1.  **Connect Repository**: Connect this GitHub repository to a new project on Railway.

2.  **Environment Variables**: Go to the **Variables** tab in your Railway project and add:

    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `SECRET_KEY`: A strong random string.
    - `DEBUG`: `False`
    - `DISABLE_COLLECTSTATIC`: `1` (Optional, if you want to skip static collection during build, though the Dockerfile handles it).

3.  **Database**: Railway usually provisions a PostgreSQL database automatically if you add it as a plugin, or you can use the default SQLite (not recommended for production persistence). If using Postgres, ensure `DATABASE_URL` is set (Railway does this automatically).

4.  **Cron Job (Daily News Generation)**:
    To generate news automatically every day:
    - Go to the **Settings** tab of your service.
    - Scroll to **Cron Schedule**.
    - Set Schedule: `0 16 * * *` (Midnight PH / 16:00 UTC).
    - Set Command: `python manage.py generate_news`

## API Documentation

The API documentation is available via Swagger UI and ReDoc:

- **Swagger UI**: `/swagger/`
- **ReDoc**: `/redoc/`

## API Endpoints

### `GET /api/news/`

Returns a list of generated news articles, ordered by date.

**Response Format:**

```json
[
  {
    "id": 1,
    "title": "Man Yells at Cloud",
    "content": "Old man yells at cloud...",
    "author": "Abe Simpson",
    "source": "Springfield Shopper",
    "date": "2023-10-27"
  }
]
```

## Management Commands

- `python manage.py generate_news`: Triggers the AI to generate a new article and saves it to the database.
