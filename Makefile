NAME = pong-together
CERT_DIR = ./certs
SSL_FILE = $(CERT_DIR)/run_openssl.sh
NGINX_SSL_DIR = $(CERT_DIR)/nginx

all: $(NAME)

$(NAME): up

up: cert
	docker-compose up --build -d

cert:
	sh $(SSL_FILE)

down:
	docker-compose down

clean:
	docker-compose down -v --rmi all

fclean: clean
	docker system prune -f
	rm -rf $(NGINX_SSL_DIR)

re:
	make fclean
	make all

.PHONY : all up down clean fclean re cert
