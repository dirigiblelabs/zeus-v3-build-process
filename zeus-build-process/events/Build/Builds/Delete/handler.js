var Credentials = require("zeus-deployer/utils/Credentials");
var BuildsApi = require("kubernetes/apis/build.knative.dev/v1alpha1/Builds");

exports.onMessage = function(message) {
	var event = JSON.parse(message);
	var build = event.entity;
	deleteBuild(build);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function deleteBuild(build) {

	var credentials = Credentials.getDefaultCredentials();
	var api = new BuildsApi(credentials.server, credentials.token, credentials.namespace);
	return api.delete(build.Name);
}
