#!/bin/bash -e

echo "Enqueueing import in Source -- $1"
rm -rf import_temp
mkdir -p import_temp
echo "*****************" >> import_temp/concepts_import.out
echo "*****************" >> import_temp/mappings_import.out
wget -O import_temp/concept_data.json $CONCEPT_DATA_URL
wget -O import_temp/mapping_data.json $MAPPING_DATA_URL
date >> import_temp/concepts_import.out
date >> import_temp/mappings_import.out
time docker-compose run ocl python manage.py import_concepts_to_source --source $1 --token $2 --inline-indexing true import_temp/concept_data.json >> import_temp/concepts_import.out 2>&1 && time docker-compose run ocl python manage.py import_mappings_to_source --source $1 --token $2 --inline-indexing true import_temp/mapping_data.json >> import_temp/mappings_import.out 2>&1
