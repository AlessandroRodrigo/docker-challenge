export class Database {
  constructor(mysql, config) {
    let that = this;

    function handleDisconnect() {
      that.connection = mysql.createConnection(config);

      that.connection.connect(function (err) {
        // If connection throws an error directly
        if (err) {
          console.log("error when connecting to db:", err);
          setTimeout(handleDisconnect, 2000);
        }

        // If connection is lost afterwards
        that.connection.on("error", function (err) {
          console.log("db error", err);
          if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
          } else {
            throw err;
          }
        });
      });
    }

    handleDisconnect();
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
