//Imports
import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";

//Init
const app = express();
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;

//Routes
app.get("/", (req, res) => {
  res.send({ msg: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
