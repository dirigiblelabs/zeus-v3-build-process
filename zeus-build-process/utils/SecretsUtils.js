var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");

exports.getServiceAccountName = function(serviceAccount) {
	return replaceAll(serviceAccount.Name.toLowerCase(), " ", "-");
};

exports.getSecretName = function(secret) {
	var serviceAccount = ServiceAccountsDao.get(secret.ServiceAccount);
	return this.getServiceAccountName(serviceAccount) + "-secret";
};

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
}