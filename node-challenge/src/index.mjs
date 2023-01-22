import express from "express";
import mysql from "mysql";
import { Database } from "./database.mjs";

const mysqlConnectionConfig = {
  host: "db",
  user: "alessandro",
  password: "123456",
  database: "node-db",
};

const database = new Database(mysql, mysqlConnectionConfig);

const cleanUpSql = `
    DROP TABLE IF EXISTS people;
`;

const createTableSql = `
    CREATE TABLE IF NOT EXISTS people (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        PRIMARY KEY (id)
    );
`;

const insertSql = `
    INSERT INTO people (name) VALUES ('Alessandro');
`;

const selectSql = `
    SELECT * FROM people;
`;

let selectResultUsername = "";

try {
  await database.query(cleanUpSql);
  console.log("Cleaned up");

  await database.query(createTableSql);
  console.log("Table created");

  await database.query(insertSql);
  console.log("Record inserted");

  const result = await database.query(selectSql);
  selectResultUsername = result[0].name;
  console.log("Select result:", result);
} catch (err) {
  console.error(err)
} finally {
  database.close();
}

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>Node.js + MySQL</h1>

    <p>
        Selected result: ${selectResultUsername}
    </p>
  `);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
