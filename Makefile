NAME = pong-together

all: $(NAME)

$(NAME): up

up: 
	docker-compose up --build -d

down:
	docker-compose down

clean:
	docker-compose down -v 

fclean: clean
	docker system prune -f

re:
	make fclean
	make all

.PHONY : all up down clean fclean re
