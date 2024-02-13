#!/bin/sh
cd /code
pip install -r requirements.txt
chmod +x manage.py
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
# gunicorn --bind 0.0.0.0:8000 test_postgres.wsgi:application
