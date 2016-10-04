var user_coll = db.auth_user;
var root_user = user_coll.find({
    username: 'root'
})[0];
var token = root_user._id;
var orgs = cat('OCL_Orgs/orgs.json').split('\n');
orgs.pop();
for(var i = 0; i < orgs.length; i++) {
	orgs[i] = JSON.parse(orgs[i]);
	orgs[i].mnemonic = orgs[i].id;
	delete(orgs[i].id);
}

var org_coll = db.orgs_organization;
var organizations = {};
var creation_date = new Date();
for (var i = 0; i < orgs.length; i++) {
    var org_object = orgs[i];
    org_object.uri = '/orgs/'+org_object.mnemonic;
    org_object.public_access = 'View';
    org_object.created_by = 'root';
    org_object.updated_by = 'root';
    org_object.is_active = true;
    org_object.created_at = creation_date;
    org_object.updated_at = creation_date;
    org_object.members = [token.valueOf()];

    var org_query = {
        mnemonic: org_object.mnemonic
    };
    org_coll.update(org_query, org_object, {
        upsert: true
    });
    organizations[org_object.mnemonic] = org_coll.find(org_object)[0];;
}

var source_coll = db.sources_source;
var source_version_coll = db.sources_sourceversion;
var sources = cat('OCL_Sources/sources.json').split('\n');
sources.pop();
for(var i = 0; i < sources.length; i++) {
	sources[i] = JSON.parse(sources[i]);
	sources[i].mnemonic = sources[i].id;
	delete(sources[i].id);
}
for (var i = 0; i < sources.length; i++) {
    var org_type_object = db.django_content_type.find({
        model: 'organization'
    })[0];
    var source_object = sources[i];
    var org = organizations[source_object.parent_org];
    delete(source_object.parent_org);
    
    var source_obj_query = {
        mnemonic: source_object.mnemonic,
        parent_id: org._id.valueOf(),
    };
    source_object.uri='/orgs/' + org.mnemonic + '/sources/' + source_object.mnemonic + '/';
    source_object.parent_id=org._id.valueOf();
    source_object.parent_type_id=org_type_object._id;
    source_object.created_by= 'root';
    source_object.updated_by= 'root';
    source_object.is_active= true;
    source_object.created_at= creation_date;
    source_object.updated_at= creation_date;

    source_coll.update(source_obj_query, source_object, {
        upsert: true
    });
    var source = source_coll.find(source_object)[0];
    var source_type_object = db.django_content_type.find({
        model: 'source'
    })[0];
    var source_version_query = {
        uri: '/orgs/' + org.mnemonic + '/sources/' + source.mnemonic + '/HEAD/'
    };
    var source_version_object = source_object;
    var source_version = source_version_coll.find(source_version_query)[0];
    
    source_version_object.mnemonic = 'HEAD'
    source_version_object.uri='/orgs/' + org.mnemonic + '/sources/' + source.mnemonic + '/HEAD/';
    source_version_object.concepts= source_version ? source_version.concepts : [];
    source_version_object.mappings= source_version ? source_version.mappings : [];
    source_version_object.versioned_object_id= source._id.valueOf();
    source_version_object.versioned_object_type_id= source_type_object._id;
    source_version_object.previous_version_id= null;
    source_version_object.parent_version_id= null;
    source_version_object._ocl_processing= false;
    source_version_object.released= false;

    source_version_coll.update(source_version_query, source_version_object, {
        upsert: true
    });
}
var perf_source = db.sources_source.find({
    mnemonic: 'CIEL'
})[0];
printjson(perf_source._id);
