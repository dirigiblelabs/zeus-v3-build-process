var Credentials = require("zeus-deployer/utils/Credentials");
var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var BuildsApi = require("kubernetes/apis/build.knative.dev/v1alpha1/Builds");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var event = JSON.parse(message);
	var build = event.entity;
	deleteBuild(build);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function deleteBuild(build) {
	var serviceAccount = ServiceAccountsDao.get(build.ServiceAccount);
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);
	var buildName = serviceAccountName + "-build";

	var credentials = Credentials.getDefaultCredentials();
	var api = new BuildsApi(credentials.server, credentials.token, credentials.namespace);
	return api.delete(buildName);
}
