#!/bin/bash

sleep 60

curl -k -u elastic:${ELASTIC_PASSWORD} \
	-X POST "https://elasticsearch:9200/_security/user/logstash_internal" \
	-H "Content-Type: application/json" \
	-d "{ \"password\" : \"${LOGSTASH_INTERNAL_PASSWORD}\", \"roles\" : [ \"superuser\" ], \"full_name\" : \"Internal Logstash User\" }"

curl -k -u elastic:${ELASTIC_PASSWORD} \
	-X POST "https://elasticsearch:9200/_security/user/kibana_system/_password" \
	-H "Content-Type: application/json" \
	-d "{ \"password\": \"${KIBANA_SYSTEM_PASSWORD}\" }"
