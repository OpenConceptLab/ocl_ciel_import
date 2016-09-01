from csv_to_json_concept import csv_to_json_concept

csv_filename = 'OCL_Orgs/OCL_Orgs.csv'
id_column = 'org_short_name'
standard_columns = [
    {'concept_field':'name', 'column':'org_full_name'},
    {'concept_field':'website', 'column':'website'},
    {'concept_field':'company', 'column':'company_name'},
    {'concept_field':'location', 'column':'location'},
]
name_columns = []
desc_columns = []
extra_columns = [
    {'key': 'resource_about', 'value_column': 'extra: resource_about'}
]

csv_to_json_concept(
    csv_filename, id_column, standard_columns=standard_columns,
    name_columns=name_columns, desc_columns=desc_columns, extra_columns=extra_columns)
