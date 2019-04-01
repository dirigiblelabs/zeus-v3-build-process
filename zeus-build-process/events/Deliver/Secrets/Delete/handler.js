var Credentials = require("zeus-deployer/utils/Credentials");
var SecretsApi = require("kubernetes/api/v1/Secrets");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var event = JSON.parse(message);
	var secretName = SecretsUtils.getSecretName(event.entity);
	deleteSecret(secretName);
};

exports.onError = function(error) {
	console.error("No Error Handler Provided: " + error);
};

function deleteSecret(name) {
	var credentials = Credentials.getDefaultCredentials();
	var api = new SecretsApi(credentials.server, credentials.token, credentials.namespace);
	return api.delete(name);
}