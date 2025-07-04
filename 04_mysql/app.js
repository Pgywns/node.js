const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./sql/.env" });

const mysql = require("./sql");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Root 경로");
});

// 조회
app.get("/customers", async (req, res) => {
  try {
    let result = await mysql.query("customerList"); // 상수로 지정해둔 custSql에서 key값으로 value에 해당하는 쿼리문을 가져옴
    res.send(result); // 결과 출력
  } catch (err) {
    res.send("에러발생=>" + err);
  }
});

// 추가
app.post("/customer", async (req, res) => {
  try {
    console.log(req.body.param);
    let data = req.body.param;
    let result = await mysql.query("customerInsert", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>" + err);
  }
});

// 수정
app.put("/customer", async (req, res) => {
  try {
    console.log(req.body.param);
    let data = req.body.param;
    let result = await mysql.query("customerUpdate", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>" + err);
  }
});

// 삭제
app.delete("/customer/:id", async (req, res) => {
  try {
    console.log(req.params);
    let { id } = req.params;
    let result = await mysql.query("customerDelete", id);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>" + err);
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000 running...!!!!!!");
});

// console.log(custSql["customerList"]);

// query("customerInsert", {
//   name: "123",
//   email: "123@email.com",
//   phone: "010-0202-0303",
//   address: "",
// });
