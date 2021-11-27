
const db = require('electron-db');
let http = require("http");
const WebSocket = require("ws");

class ElectronProfiles {
  profileTable = "profiles";
  server;
  wss;
  win;

  close = () =>{    
    if (this.wss !== undefined) this.wss.close();
    if (this.server !== undefined) this.server.close();
  }

  startServer = (win) => {
    this.server = http.createServer();
    this.win = win;

    this.wss = new WebSocket.Server({ server: this.server });
    this.wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        console.log('received: %s', data);
        const matchToggle = data.match(/toggle\/(.*)/);
        let allProfiles = await this.getTable();
        if (data === "profiles") {
          ws.send(JSON.stringify(allProfiles))
        }
        else if (matchToggle.length === 2) {
          const id = matchToggle[1];
          let matchingRows = await this.getRowsPromise({ id: parseInt(id) });
          if (matchingRows.length > 0) {
            allProfiles.forEach(async (p) => {
              if (p.id === id) {
                await this.updateRowPromise({ ...p, enabled: true });
              } else {
                await this.updateRowPromise({ ...p, enabled: false });
              }
            })
            this.win.webContents.send("profile-enabled", id);
            ws.send("Profile activated!")
          } else {
            ws.send("Profile unable to be activated");
          }
        }
      });

      ws.send('something');
    });
    this.server.listen(8081);
  };
  getAllPromise = () => {
    return new Promise((resolve, reject) => {
      db.getAll(this.profileTable, (isSuccess, data) => {
        console.log("getAll: " + isSuccess);
        if (!isSuccess) return reject([]);
        return resolve(data);
      })
    })
  };
  createTablePromise = (tableName) => {
    return new Promise((resolve, reject) => {
      db.createTable(tableName, (isSuccess, msg) => {
        console.log("createTable: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(msg);
      })
    })
  };
  deleteRowPromise = (id) => {
    return new Promise((resolve, reject) => {
      db.deleteRow(this.profileTable, { "id": id }, (isSuccess, msg) => {
        console.log("deleteRow: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(msg);
      });
    })
  };
  updateRowPromise = (value) => {
    return new Promise((resolve, reject) => {
      console.log("Looking for id: " + value.id);
      db.updateRow(this.profileTable, { "id": value.id }, value, (isSuccess, msg) => {
        console.log("updateRow: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(msg);
      });
    })
  };
  insertTableContentPromise = (tableName, value) => {
    return new Promise((resolve, reject) => {
      db.insertTableContent(tableName, value, (isSuccess, msg) => {
        console.log("insertTableContent: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(msg);
      })
    })
  };
  getRowsPromise = (value) => {
    return new Promise((resolve, reject) => {
      db.getRows(this.profileTable, { "id": value.id }, (isSuccess, msg) => {
        console.log("getRows: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(msg);
      })
    })
  };
  deleteFromTable = async (e, id) => {
    return await this.deleteRowPromise(id);
  };
  checkProfileTable = () => {
    return db.tableExists(this.profileTable);
  };
  getTable = async () => {
    return await this.getAllPromise(this.profileTable);
  };
  createTable = async () => {
    return await this.createTablePromise(this.profileTable);
  };
  updateTable = async (e, value) => {
    console.log("Updating value: " + JSON.stringify(value));
    const exists = !!value.id || await this.getRowsPromise(value).length > 0;
    console.log("Table row exists: " + exists);
    if (exists) {
      return await this.updateRowPromise(value);
    } else {
      if (db.valid(this.profileTable)) {
        return await this.insertTableContentPromise(this.profileTable, value);
      }
      else {
        console.log("db isn't valid bro");
        return;
      }
    }
  };
}
module.exports = ElectronProfiles;