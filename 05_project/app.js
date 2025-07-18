const express = require("express");
require("dotenv").config({ path: "./mysql/.env" });
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const { query } = require("./mysql/index.js");
const bodyParser = require("body-parser");

const app = express(); // 인스턴스 생성

// 업로드 경로 확인
let uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  // 경로에 디렉토리가 있는지 체크
  fs.mkdirSync(uploadDir);
}

// body-parser
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.listen(3000, () => {
  console.log("npm install");
  console.log("http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("Root Router");
});

app.get("/fileupload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 다운로드
app.get("/download/:productId/:fileName", (req, res) => {
  const { productId, fileName } = req.params;
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`;
  // 응답정보
  res.header(
    "Content-Type",
    `image/${fileName.substring(fileName.lastIndexOf("."))}`
  );
  if (!fs.existsSync(filepath)) {
    console.log("파일이 없습니다.");
    return res.status(404).json({ error: "Can not found file" });
  }

  fs.createReadStream(filepath).pipe(res);
  // res.send("다운로드 완료");
});

// 업로드
app.post("/upload/:filename/:pid/:type", (req, res) => {
  const { filename, pid, type } = req.params;
  // express.urlencoded();
  // const filePath = `${__dirname}/uploads/${filename}`;

  let productDir = path.join(uploadDir, pid);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir);
  }

  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, pid, safeFilename);

  try {
    let base64Data = req.body.data;
    let data = base64Data.slice(base64Data.indexOf(";base64,") + 8);
    fs.writeFile(filePath, data, "base64", async (err) => {
      await query(
        "productImageInsert",
        [{ product_id: pid, type: type, path: filename }],
        req.body.where
      );
      if (err) {
        res.send("error");
      } else {
        res.send("success");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// 데이터 쿼리
app.post("/api/:alias", async (req, res) => {
  // console.log(req.params.alias);
  // console.log(req.body.param);
  // console.log(req.body.where);

  const result = await query(req.params.alias, req.body.param, req.body.where);
  res.send(result);
});

app.get("/todoList", async (req, res) => {
  const result = await query("todoList");
  console.log(result);
  res.json(result);
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("todoDelete", id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});
