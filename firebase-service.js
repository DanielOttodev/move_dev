var admin = require("firebase-admin");

var serviceAccount = require("/serviceAccountsKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://movesapp-cf511.firebaseio.com"
});