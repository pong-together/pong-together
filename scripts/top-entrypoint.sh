#!/bin/sh
cd /code
chmod +x manage.py
python3 manage.py loaddata dummy_data.json
python3 manage.py migrate
gunicorn --bind 0.0.0.0:8000 pong_together.wsgi:application
