var base64 = require("utils/v4/base64");
var Credentials = require("zeus-deployer/utils/Credentials");
var SecretsApi = require("kubernetes/api/v1/Secrets");
var SecretsBuilder = require("kubernetes/builders/api/v1/Secret");
var SecretsDao = require("zeus-build/data/dao/Deliver/Secrets");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var entity = JSON.parse(message);
	var secret = SecretsDao.get(entity.key.value);
	var secretName = SecretsUtils.getSecretName(secret);
	createSecret(secretName, secret.Username, secret.Password);
};

exports.onError = function(error) {
	console.error("No Error Handler Provided: " + error);
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