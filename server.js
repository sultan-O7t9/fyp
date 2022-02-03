//Imports
// import express from "express";
// import cors from "cors";
// import dotenv, { config } from "dotenv";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const dbConfig = require("./config.js");
//Init
const app = express();
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;

//Routes
app.get("/", (req, res) => {
  res.send({ msg: "Hello World" });
});

const connection = mysql.createConnection(dbConfig);

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

let sql = "SELECT * FROM `tbl_department`";
connection.query(sql, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log(results);
});
