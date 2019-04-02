var Credentials = require("zeus-deployer/utils/Credentials");
var BuildsDao = require("zeus-build/data/dao/Build/Builds");
var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var BuildsApi = require("kubernetes/apis/build.knative.dev/v1alpha1/Builds");
var BuildsBuilder = require("kubernetes/builders/apis/build.knative.dev/v1alpha1/Build");
var SecretsUtils = require("zeus-build-process/utils/SecretsUtils");

exports.onMessage = function(message) {
	var entity = JSON.parse(message);
	var build = BuildsDao.get(entity.key.value);
	createBuild(build);
};

exports.onError = function(error) {
	console.error("Not Implemented: " + error);
};

function createBuild(build) {
	var serviceAccount = ServiceAccountsDao.get(build.ServiceAccount);
	var serviceAccountName = SecretsUtils.getServiceAccountName(serviceAccount);

	var builder = new BuildsBuilder();
	builder.getMetadata().setName(serviceAccountName + "-build");
	builder.getSpec().setServiceAccountName(serviceAccountName);
	builder.getSpec().getSource().getGit().setUrl(build.GitUrl);
	builder.getSpec().getSource().getGit().setRevision(build.GitRevision);
	builder.getSpec().getTemplate().setName("kaniko");
	builder.getSpec().getTemplate().seteArguments([{
		name: "IMAGE",
		value: build.Image
	}]);

	var entity = builder.build();

	var credentials = Credentials.getDefaultCredentials();
	var api = new BuildsApi(credentials.server, credentials.token, credentials.namespace);
	return api.create(entity);
}
