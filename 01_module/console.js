const { Console } = require("console");
const fs = require("fs");
const express = require("express"); // 외부모듈

const output = fs.createWriteStream("./sample/output.log", { flags: "a" });
const errlog = fs.createWriteStream("./sample/errlog.log", { flags: "a" });

const logger = new Console({
  stdout: output,
  stderr: errlog,
});

logger.log("로그기록하기");
logger.error("에러로그기록하기");

console.log("end ");
