#!/bin/sh
ELK_EXEC_PATH=$PWD/elk/elasticsearch-8.2.3/bin
PATH+=:$ELK_EXEC_PATH
if [ ! -d $ELK_EXEC_PATH ]; then
	curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.2.3-darwin-x86_64.tar.gz
    tar -xzvf elasticsearch-8.2.3-darwin-x86_64.tar.gz
    rm -rf elasticsearch-8.2.3-darwin-x86_64.tar.gz
	mv elasticsearch-8.2.3 elk/
fi

ELASTIC_DIR=$PWD/elk/certs
if [ ! -d $ELASTIC_DIR ]; then
	mkdir -p $ELASTIC_DIR
fi

if [ ! -f $ELASTIC_DIR/ca/ca.key ]; then
    elasticsearch-certutil ca \
		--silent \
		--pem \
		--out $ELASTIC_DIR/ca.zip

	unzip $ELASTIC_DIR/ca.zip -d $ELASTIC_DIR > /dev/null
	rm $ELASTIC_DIR/ca.zip    
fi

if [ ! -f $ELASTIC_DIR/elasticsearch/elasticsearch.key ]; then
    elasticsearch-certutil cert \
		--silent \
		--pem \
		--in $PWD/elk/instances.yml \
		--ca-cert $ELASTIC_DIR/ca/ca.crt \
		--ca-key $ELASTIC_DIR/ca/ca.key \
		--out $ELASTIC_DIR/certs.zip

	unzip $ELASTIC_DIR/certs.zip -d $ELASTIC_DIR/ > /dev/null
	rm $ELASTIC_DIR/certs.zip
fi