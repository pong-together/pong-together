FROM python:3.12
COPY ./srcs/requirements.txt . 
RUN chmod +x requirements.txt
RUN pip install -r requirements.txt
WORKDIR /scripts
COPY ./scripts /scripts
RUN chmod +x entrypoint.sh top-entrypoint.sh
EXPOSE 8000
CMD sh /scripts/entrypoint.sh
