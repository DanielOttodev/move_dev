const express = require("express");
const app = express();
const port = process.env.PORT || 443;
const path = require("path");
const bodyParser = require("body-parser")
const csrf = require('csurf');
const cookieParser = require('cookie-parser')
const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountsKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://movesapp-cf511.firebaseio.com",
});

const csrfMiddleware = csrf({
  cookie: true
})

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json());
//app.use(cookieParser());
//app.use(csrfMiddleware);

//static folders

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public/src"));
app.use(express.static("public/views"));
app.use(express.static("public/imgs"));


app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/views/login.html");
});
app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/public/views/app.html");
  console.log('success')
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
