#!/bin/bash -e

BULK_IMPORT_SCRIPT="`cat perf_data/prepare_bulk_import_db_with_root_user.js`"
echo $BULK_IMPORT_SCRIPT
OBJECT_ID=`docker exec -t ocl_mongo mongo ocl --eval "$BULK_IMPORT_SCRIPT" | grep ObjectId`
echo $OBJECT_ID
SOURCE=`echo $OBJECT_ID | cut -c 11-34`
export DJANGO_CONFIGURATION=Staging
echo "Enqueueing import in Source -- $SOURCE"
rm -rf import_temp
mkdir -p import_temp
echo "*****************" >> import_temp/concepts_import.out
echo "*****************" >> import_temp/mappings_import.out
wget -O import_temp/concept_data.json $CONCEPT_DATA_URL
wget -O import_temp/mapping_data.json $MAPPING_DATA_URL
date >> import_temp/concepts_import.out
date >> import_temp/mappings_import.out
time docker-compose run ocl python manage.py import_concepts_to_source --source $SOURCE --token $1 --inline-indexing true import_temp/concept_data.json >> import_temp/concepts_import.out 2>&1 && time docker-compose run ocl python manage.py import_mappings_to_source --source $SOURCE --token $1 --inline-indexing true import_temp/mapping_data.json >> import_temp/mappings_import.out 2>&1
