
const db = require('electron-db');
const WebSocket = require("ws");

class ElectronVtube {
  vtubeAuthTable = "vtube";
  requestID = "420_69modelswitcher69_420";
  mainVtubeWs = undefined;

  close = ()=>{
    if (this.mainVtubeWs !== undefined) this.mainVtubeWs.close()
  }
  updateVtube = (e, data) => {
    return new Promise((resolve, reject) => {
      db.updateRow(this.vtubeAuthTable, { "id": data.id }, data, (isSuccess, msg) => {
        console.log("updateRow: " + isSuccess);
        if (!isSuccess) {
          console.log("Message: " + msg);
          return reject(msg);
        }
        return resolve(data);
      })
    });
  };
  getVtubeTable = () => {
    return new Promise(async (resolve, reject) => {
      if (!db.tableExists(this.vtubeAuthTable)) {
        db.createTable(this.vtubeAuthTable, (isSuccess, msg) => {
          console.log("createTable: " + isSuccess);
          if (!isSuccess) {
            console.log("Message: " + msg);
            return reject(msg);
          }
          db.insertTableContent(this.vtubeAuthTable, { domain: "0.0.0.0", port: "8081" }, (isSuccess, msg) => {
            console.log("insertTableContent: " + isSuccess);
            if (!isSuccess) {
              console.log("Message: " + msg);
              return reject(msg);
            }
          })
        })
      }
      db.getAll(this.vtubeAuthTable, (isSuccess, data) => {
        console.log("getAll: " + isSuccess);
        if (!isSuccess) return reject([]);
        return resolve(data[0]);
      });
    })
  };
  getVtubeAuth = async () => {
    return await this.getVtubeTable().auth;
  };
  authVtube = async (event) => {
    const ws = new WebSocket('ws://localhost:8001');
    ws.on('open', () => {
      ws.send(JSON.stringify({
        "apiName": "VTubeStudioPublicAPI",
        "apiVersion": "1.0",
        "this.requestID": this.requestID,
        "messageType": "APIStateRequest"
      }));
    });

    const handleStateBroadcastOk = async (response) => {
      if (response.apiName === "VTubeStudioPublicAPI" && response.apiVersion === "1.0") {
        if (!!response.data.errorID) {
          event.reply('vtube-auth-reply', { ok: false, message: response.data.message });
        }
        ws.send(JSON.stringify({
          "apiName": "VTubeStudioPublicAPI",
          "apiVersion": "1.0",
          "this.requestID": this.requestID,
          "messageType": "AuthenticationTokenRequest",
          "data": {
            "pluginName": "Modelswitcher",
            "pluginDeveloper": "Goofy Honko@ha0nk",
            // "pluginIcon": "iVBORw0.........KGgoA="
          }
        }))
      }
      else {
        event.reply('vtube-auth-reply', { ok: false, message: "Can't handle the current version of VTube Studio API, need to upgrade." });
      }
    }

    const handleAuthenticationTokenResponse = async (response) => {
      if (!!response.data.errorID) {
        event.reply('vtube-auth-reply', { ok: false, message: response.data.message });
      }
      ws.close();
      const oldData = await this.getVtubeTable();
      const currentData = { ...oldData, auth: response.data.authenticationToken, authenticated: true };
      await this.updateVtube({}, currentData);
      event.reply('vtube-auth-reply', { ok: true, message: "Vtube Studio Authenticated", data: currentData });
    }

    ws.on('message', async (data) => {
      console.log('received: %s', data);
      const response = JSON.parse(data);
      if (response.messageType === "APIStateResponse") {
        handleStateBroadcastOk(response);
      }
      else if (response.messageType === "AuthenticationTokenResponse") {
        handleAuthenticationTokenResponse(response);
      } else {
        event.reply('vtube-auth-reply', { ok: false, message: `Response was unhandled, is ${response.messageType}.` });
      }
    });
  };
  connectVtube = async (event) => {
    this.mainVtubeWs = new WebSocket('ws://localhost:8001');
    this.mainVtubeWs.on('open', () => {
      this.mainVtubeWs.send(JSON.stringify({
        "apiName": "VTubeStudioPublicAPI",
        "apiVersion": "1.0",
        "this.requestID": this.requestID,
        "messageType": "APIStateRequest"
      }));
    });
    const oldData = await this.getVtubeTable();
    if (!oldData.auth) {
      const currentData = { ...oldData, authenticated: false };
      await this.updateVtube({}, currentData);
      event.reply('vtube-connect-reply', { ok: false, message: "Vtube Studio Needs Authentication", data: currentData });
      return;
    }

    const handleStateBroadcastOk = async (response) => {
      if (response.apiName === "VTubeStudioPublicAPI" && response.apiVersion === "1.0") {
        if (!!response.data.errorID) {
          event.reply('vtube-connect-reply', { ok: false, message: response.data.message });
        }
        this.mainVtubeWs.send(JSON.stringify({
          "apiName": "VTubeStudioPublicAPI",
          "apiVersion": "1.0",
          "this.requestID": this.requestID,
          "messageType": "AuthenticationRequest",
          "data": {
            "pluginName": "Modelswitcher",
            "pluginDeveloper": "Goofy Honko@ha0nk",
            "authenticationToken": oldData.auth
          }
        }))
      }
      else {
        event.reply('vtube-connect-reply', { ok: false, message: "Can't handle the current version of VTube Studio API, need to upgrade." });
      }
    }

    this.mainVtubeWs.on('message', async (data) => {
      console.log('received: %s', data);
      const response = JSON.parse(data);
      if (response.messageType === "APIStateResponse") {
        handleStateBroadcastOk(response);
      }
      else if (response.messageType === "AuthenticationResponse") {
        if (response.data.authenticated === true) {
          const currentData = { ...oldData, connected: true };
          await this.updateVtube({}, currentData);
          event.reply('vtube-connect-reply', { ok: true, message: "Vtube Studio Connected", data: currentData });
        }
      } else {
        event.reply('vtube-connect-reply', { ok: false, message: `Response was unhandled, is ${response.messageType}.` });
      }
    });
  };
  getAllModels = async (event) => {
    const oldData = await this.getVtubeTable();
    this.mainVtubeWs.send(JSON.stringify({
      "apiName": "VTubeStudioPublicAPI",
      "apiVersion": "1.0",
      "this.requestID": this.requestID,
      "messageType": "AvailableModelsRequest",
      "data": {
        "pluginName": "Modelswitcher",
        "pluginDeveloper": "Goofy Honko@ha0nk",
        "authenticationToken": oldData.auth
      }
    }));

    this.mainVtubeWs.on('message', async (data) => {
      console.log('received: %s', data);
      const response = JSON.parse(data);
      if (response.messageType === "AvailableModelsResponse") {
        event.reply('vtube-list-reply', { ok: true, message: "Vtube Models Received", data: response.data.availableModels });
      } else {
        event.reply('vtube-list-reply', { ok: false, message: `Response was unhandled, is ${response.messageType}.` });
      }
    });
  };
  switchModel = async (event) => {

  };
};

module.exports = ElectronVtube;