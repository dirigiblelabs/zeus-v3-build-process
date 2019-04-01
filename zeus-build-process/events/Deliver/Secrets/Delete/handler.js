var Credentials = require("zeus-deployer/utils/Credentials");
var SecretsApi = require("kubernetes/api/v1/Secrets");
var ServiceAccountsApi = require("kubernetes/api/v1/ServiceAccounts");
var ServiceAccountsBuilder = require("kubernetes/builders/api/v1/ServiceAccount");
var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var event = JSON.parse(message);
	var secret = event.entity;
	deleteSecret(secret);
	removeSecretFromServiceAccount(secret)
};

exports.onError = function(error) {
	console.error("No Error Handler Provided: " + error);
};

function deleteSecret(secret) {
	var secretName = SecretsUtils.getSecretName(secret);
	var credentials = Credentials.getDefaultCredentials();
	var api = new SecretsApi(credentials.server, credentials.token, credentials.namespace);
	return api.delete(secretName);
}

function removeSecretFromServiceAccount(secret) {
	var secretName = SecretsUtils.getSecretName(secret);
	var serviceAccount = ServiceAccountsDao.get(secret.ServiceAccount);
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);

	var credentials = Credentials.getDefaultCredentials();
	var api = new ServiceAccountsApi(credentials.server, credentials.token, credentials.namespace);
	var serviceAccountEntity = api.get(serviceAccountName);

	var secrets = serviceAccountEntity.secrets.filter(e => e.name !== secretName);
	var builder = new ServiceAccountsBuilder();
	builder.setSecrets(secrets);
	var entity = builder.build();

	api.merge(serviceAccountName, entity);
}