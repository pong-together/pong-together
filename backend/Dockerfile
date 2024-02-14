FROM python:3.12
WORKDIR /scripts
COPY ./scripts /scripts
RUN chmod +x entrypoint.sh top-entrypoint.sh
EXPOSE 8000
CMD sh /scripts/entrypoint.sh
