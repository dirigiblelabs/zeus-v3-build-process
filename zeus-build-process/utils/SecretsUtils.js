var ServiceAccountsDao = require("zeus-build/data/dao/Deliver/ServiceAccounts");

exports.getSecretName = function(secret) {
	var serviceAccount = ServiceAccountsDao.get(secret.ServiceAccount);
	var serviceAccountName = serviceAccount.Name;
	var secretName = replaceAll(serviceAccountName.toLowerCase(), " ", "-");
	return secretName + "-secret";
};

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
}