const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
require("dotenv").config({ path: "./sql/.env" });
const nodemailer = require("./nodemailer");

const mysql = require("./sql");

// 파일업로드 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 저장경로
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // 업로드 파일명
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, Date.now() + "_" + fn);
  },
});

// Multer 인스턴스 생성
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Root 경로");
});

app.get("/email", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/email", async (req, res) => {
  try {
    let result = await nodemailer.sendEmail(req.body.param);
    console.log(result);
    res.send("메일발송 성공");
  } catch (err) {
    res.send("메일발송 실패");
  }
});

// 이메일 발송화면
app.get("/excel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "excel.html"));
});

app.post("/excel", upload.single("myFile"), async (req, res) => {
  console.log(req.file); // 업로드된 파일의 정보
  console.log(req.body); // 요청 몸체의 정보
  const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
  const firstSheetName = workbook.SheetNames[0]; // 첫번째 시트
  // 시트명으로 첫번째 시트가져오기
  const firstSheet = workbook.Sheets[firstSheetName];
  // 첫번째 시트의 데이터를 json으로 생성
  const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet);
  console.log(firstSheetJson);

  const fsj = firstSheetJson // 객체는 순서가 없음
    .sort((a, b) => {
      return a.name < b.name;
    });

  // fsj.forEach(async (data) => {
  //   let result = await mysql.query("customerInsert", data);
  // });
  for (const data of fsj) {
    await mysql.query("customerInsert", data);
  }

  if (!req.file) {
    res.send("이미지 처리가능함");
  } else {
    res.send("업로드 완료");
  }
});

// db데이터 시트변환
app.get("/download-excel", async (req, res) => {
  try {
    // 1. DB에서 데이터 조회 (예시: 모든 고객 데이터)
    const results = await mysql.query("customerList");

    // 2. JSON 데이터를 시트로 변환
    const worksheet = xlsx.utils.json_to_sheet(results);

    // 3. 워크북 생성 및 시트 추가
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Customers");

    // 4. 워크북을 버퍼로 변환 (파일로 저장하지 않고 바로 전송)
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 5. 다운로드 응답 헤더 설정
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="customers.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // 6. 버퍼 전송
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("엑셀 파일 생성 실패");
  }
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
