#!/bin/sh
cd /code
chmod +x manage.py
python3 manage.py makemigrations
python3 manage.py migrate
exec daphne -b 0.0.0.0 -p 8000 pong_together.asgi:application
