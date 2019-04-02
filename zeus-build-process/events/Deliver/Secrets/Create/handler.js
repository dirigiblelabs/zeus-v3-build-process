var base64 = require("utils/v4/base64");
var Credentials = require("zeus-deployer/utils/Credentials");
var SecretsApi = require("kubernetes/api/v1/Secrets");
var ServiceAccountsApi = require("kubernetes/api/v1/ServiceAccounts");
var SecretsBuilder = require("kubernetes/builders/api/v1/Secret");
var ServiceAccountsBuilder = require("kubernetes/builders/api/v1/ServiceAccount");
var SecretsDao = require("zeus-build/data/dao/Deliver/Secrets");
var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var entity = JSON.parse(message);
	var secret = SecretsDao.get(entity.key.value);
	createSecret(secret);
	addSecretToServiceAccount(secret);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function createSecret(secret) {
	var secretName = SecretsUtils.getSecretName(secret);
	var secretTypeName = SecretsUtils.getSecretTypeName(secret);
	var annotations = {};
	annotations["build.knative.dev/" + secretTypeName + "-0"] = secret.Host;
	var builder = new SecretsBuilder();
	builder.getMetadata().setName(secretName);
	builder.getMetadata().setAnnotations(annotations);
	builder.setType("kubernetes.io/basic-auth");
	builder.setData({
		username: base64.encode(secret.Username),
		password: base64.encode(secret.Password)
	});
	
	var entity = builder.build();

	var credentials = Credentials.getDefaultCredentials();
	var api = new SecretsApi(credentials.server, credentials.token, credentials.namespace);
	return api.create(entity);
}

function addSecretToServiceAccount(secret) {
	var secretName = SecretsUtils.getSecretName(secret);
	var serviceAccount = ServiceAccountsDao.get(secret.ServiceAccount);
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);

	var builder = new ServiceAccountsBuilder();
	builder.setSecrets([{
		name: secretName
	}]);

	var entity = builder.build();

	var credentials = Credentials.getDefaultCredentials();
	var api = new ServiceAccountsApi(credentials.server, credentials.token, credentials.namespace);
	return api.merge(serviceAccountName, entity);
}