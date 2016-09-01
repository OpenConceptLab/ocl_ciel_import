from csv_to_json_concept import csv_to_json_concept

csv_filename = 'OCL_Sources/OCL_Sources.csv'
id_column = 'short_code'
standard_columns = [
    {'concept_field':'full_name', 'column':'full_name'},
    {'concept_field':'website', 'column':'website'},
    {'concept_field':'default_locale', 'column':'default_locale'},
    {'concept_field':'source_type', 'column':'source_type'},
    {'concept_field':'default_locale', 'column':'default_locale'},
    {'concept_field':'description', 'column':'description'},
    {'concept_field':'parent_org', 'column':'org'},
    {'concept_field':'public_access', 'column':'public_access'},
	{'concept_field':'external_id', 'column':'external_id'},
	{'concept_field':'name', 'column':'short_code'},
	{'concept_field':'supported_locales', 'column':'supported_locales', 'array_type': True},
]
name_columns = []
desc_columns = []
extra_columns = [
	{'key': 'hl7_code', 'value_column': 'extra: hl7_code'}
]

csv_to_json_concept(
    csv_filename, id_column, standard_columns=standard_columns,
    name_columns=name_columns, desc_columns=desc_columns, extra_columns=extra_columns)
