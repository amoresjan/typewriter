dev-backend:
	cd backend && bash -c "source venv/bin/activate && python manage.py runserver"

migrate:
	cd backend && bash -c "source venv/bin/activate && python manage.py migrate"

generate-news:
	cd backend && bash -c "source venv/bin/activate && python manage.py generate_news"

install-backend:
	cd backend && python3 -m venv venv && bash -c "source venv/bin/activate && pip install -r requirements.txt"
