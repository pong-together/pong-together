#!/bin/sh
cd /code
chmod +x manage.py
python3 manage.py makemigrations
python3 manage.py migrate
exec python3 manage.py runserver 0.0.0.0:8000
