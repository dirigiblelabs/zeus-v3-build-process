var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");
var SecretTypesDao = require("zeus-build/data/dao/Deliver/SecretTypes");

exports.getServiceAccountName = function(serviceAccount) {
	return replaceAll(serviceAccount.Name.toLowerCase(), " ", "-");
};

exports.getSecretName = function(secret) {
	var serviceAccount = ServiceAccountsDao.get(secret.ServiceAccount);
	return this.getServiceAccountName(serviceAccount) + "-secret";
};

exports.getSecretTypeName = function(secret) {
	return SecretTypesDao.get(secret.SecretType).Name.toLowerCase();
};

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
}