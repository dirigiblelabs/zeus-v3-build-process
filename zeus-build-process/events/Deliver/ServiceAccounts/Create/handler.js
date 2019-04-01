var Credentials = require("zeus-deployer/utils/Credentials");
var ServiceAccountsApi = require("kubernetes/api/v1/ServiceAccounts");
var ServiceAccountsBuilder = require("kubernetes/builders/api/v1/ServiceAccount");
var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var entity = JSON.parse(message);
	var serviceAccount = ServiceAccountsDao.get(entity.key.value);
	createServiceAccount(serviceAccount);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function createServiceAccount(serviceAccount) {
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);
	var builder = new ServiceAccountsBuilder();
	builder.getMetadata().setName(serviceAccountName);

	var entity = builder.build();

	var credentials = Credentials.getDefaultCredentials();
	var api = new ServiceAccountsApi(credentials.server, credentials.token, credentials.namespace);
	return api.create(entity);
}