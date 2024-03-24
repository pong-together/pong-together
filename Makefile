NAME = pong-together
NGINX_SETUP_FILE = nginx/setup.sh
ELK_SETUP_FILE = elk/setup.sh
NGINX_CERTS_DIR = nginx/certs
ELK_CERTS_DIR = elk/certs

all: $(NAME)

$(NAME): up

up: cert
	docker-compose up --build -d

setup:
	sh $(NGINX_SETUP_FILE)
	sh $(ELK_SETUP_FILE)

down:
	docker-compose down

clean:
	docker-compose down -v --rmi all

fclean: clean
	docker system prune -f
	rm -rf $(NGINX_CERTS_DIR) $(ELK_CERTS_DIR)

re:
	make fclean
	make all

.PHONY : all up down clean fclean re cert
