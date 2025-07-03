const mysql = require("mysql2");
const custSql = require("./sql/customerSql");

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "dev01",
  password: "dev01",
  database: "dev",
  connectionLimit: 10,
});

let data = ["name01", "test@email.com", "010-1111-2222", ""];
data = [
  {
    name: "username",
    email: "user@email.com",
    phone: "010-0101-0202",
    address: "",
  },
  1,
];

// console.log(custSql["customerList"]);
function query(alias, values) {
  pool.query(custSql[alias], values, (err, result) => {
    if (err) {
      console.log("처리중 에러", err);
    } else {
      console.log(result);
    }
  });
}

query("customerInsert", {
  name: "123",
  email: "123@email.com",
  phone: "010-0202-0303",
  address: "",
});
