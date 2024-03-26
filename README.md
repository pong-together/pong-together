# pong-together
## 인증서 파일 생성
~~~shell
make setup
~~~
<br>

> 요구되는 파일

    - elk/setup.sh
    - nginx/setup.sh

<br>

## 서버 실행
### 1. 환경변수 설정
#### docker-compose 환경변수 파일<br>
>경로: <strong>./.env </strong>
~~~txt
# Common
IP= 
PORT= 
ENDPOINT=${IP}:${PORT}

# Django
SECRET_KEY= 
LOG_DIR= # 로그 저장 경로. 미지정 시 ./backend/srcs/log

POSTGRES_HOST= # 미지정시 localhost

#OAuth2.0 
CLIENT_ID= 
CLIENT_SECRET=
REDIRECT_URI=
STATE=

# postgreSQL
POSTGRES_DB=
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=

# ELK
ELASTIC_PASSWORD=
LOGSTASH_INTERNAL_PASSWORD=
KIBANA_SYSTEM_PASSWORD=
~~~


#### frontend 환경변수 파일<br>

>경로: <strong>./nginx/frontend/.env </strong>
~~~txt
# Common
IP=
PORT=
ENDPOINT=${IP}:${PORT}

VITE_BASE_URL=https://${ENDPOINT}
VITE_SOCKET_URL=wss://${ENDPOINT}
~~~

### 2. 도커 컴포즈 실행 
~~~shell
make
# or
make setup
docker-compose up --build
~~~

### 3. 웹페이지 접근
> https://\${IP}:\${PORT}

<br>

# Makefile
> 도커 컴포즈 종료
~~~shell
make down
~~~

<br>


> 볼륨, 이미지와 함께 도커 컴포즈 종료
~~~shell
make clean
~~~
<br>


> setup 파일 삭제 및 도커 컴포즈 종료
~~~shell
make fclean
~~~
<br>


> 도커 컴포즈 종료 후 프로그램 재실행
~~~shell
make re
~~~