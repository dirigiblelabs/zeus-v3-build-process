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
	var secretName = SecretsUtils.getSecretName(secret);
	createSecret(secretName, secret.Username, secret.Password);
	addSecretToServiceAccount(secret, secretName);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function createSecret(name, username, passworrd) {
	var builder = new SecretsBuilder();
	builder.getMetadata().setName(name);
	builder.setType("kubernetes.io/basic-auth");
	builder.setData({
		username: base64.encode(username),
		passworrd: base64.encode(passworrd)
	});
	
	var entity = builder.build();

	var credentials = Credentials.getDefaultCredentials();
	var api = new SecretsApi(credentials.server, credentials.token, credentials.namespace);
	return api.create(entity);
}

function addSecretToServiceAccount(secret, secretName) {
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