# pong-together
## Makefile
> 도커 컴포즈 실행
~~~shell
make
~~~
<br>

> 도커 컴포즈 다운
~~~shell
make down
~~~
<br>


> 도커 컴포즈 다운 시,<br>
 도커 볼륨 및 이미지 삭제
~~~shell
make clean
~~~
<br>


> 도커 시스템 가지치기<br> 
> (컨테이너, 이미지, 볼륨, 네트워크)
~~~shell
make fclean
~~~
<br>


> 도커 컴포즈 다운 후 재실행
~~~shell
make re
~~~