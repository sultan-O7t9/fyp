const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
//Init
const app = express();
app.use(cors());
dotenv.config();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
