var Credentials = require("zeus-deployer/utils/Credentials");
var ServiceAccountsApi = require("kubernetes/api/v1/ServiceAccounts");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var event = JSON.parse(message);
	deleteServiceAccount(event.entity);
};

exports.onError = function(error) {
	console.error("No Error Handler Provided: " + error);
};

function deleteServiceAccount(serviceAccount) {
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);

	var credentials = Credentials.getDefaultCredentials();
	var api = new ServiceAccountsApi(credentials.server, credentials.token, credentials.namespace);
	return api.delete(serviceAccountName);
}