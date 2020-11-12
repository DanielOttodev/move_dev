const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

//static folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public/src"));
app.use(express.static("public/views"));
app.use(express.static("public/imgs"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
