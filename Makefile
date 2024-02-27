NAME = pong-together

all: $(NAME)

$(NAME): up

up: 
	docker-compose up --build -d

down:
	docker-compose down

clean:
	docker-compose down --rmi all --volumes

fclean: clean
	docker system prune

re: 
	make fclean
	make all

.PHONY : all up down clean fclean re