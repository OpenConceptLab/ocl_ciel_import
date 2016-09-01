#!/bin/bash -e

SOURCE=$1
TOKEN=$2
echo "Enqueueing import in Source -- $SOURCE"
rm -rf import_temp
mkdir -p import_temp
echo "*****************" > import_temp/concepts_import.out
echo "*****************" > import_temp/mappings_import.out
wget -O import_temp/concept_data.json $CONCEPT_DATA_URL
wget -O import_temp/mapping_data.json $MAPPING_DATA_URL
date > import_temp/concepts_import.out
date > import_temp/mappings_import.out
docker-compose run -d --name ocl_import ocl bash -c "python manage.py import_concepts_to_source --source $SOURCE --token $TOKEN --inline-indexing true import_temp/concept_data.json >> import_temp/concepts_import.out 2>&1 && python manage.py import_mappings_to_source --source $SOURCE --token $TOKEN --inline-indexing true import_temp/mapping_data.json >> import_temp/mappings_import.out 2>&1"