const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
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
app.use(cookieParser());
app.use(csrfMiddleware);

//static folders

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public/src"));
app.use(express.static("public/views"));
app.use(express.static("public/imgs"));

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/views/login.html");
});

app.get("/home", function (req, res) {
  const sessionCookie = req.cookies.session || "";
  console.log(sessionCookie)
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */ )
    .then(() => {
      res.render("app.html");
      console.log('success')
    })
    .catch((error) => {
      res.redirect("/login");
      console.log('redirected...')
    });
});
app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, {
      expiresIn
    })
    .then(
      (sessionCookie) => {
        const options = {
          maxAge: expiresIn,
          httpOnly: true
        };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({
          status: "success"
        }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});