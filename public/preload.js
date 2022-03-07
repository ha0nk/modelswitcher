const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  profiles: {
    exist() {
      return ipcRenderer.invoke("profiles-exists");
    },
    async setup() {
      return await ipcRenderer.invoke("profiles-create");
    },
    async get() {
      return await ipcRenderer.invoke("profiles-get");
    },
    profile: {
      async set(value) {
        return await ipcRenderer.invoke("profiles-update", value);
      },
      async delete(id) {
        return await ipcRenderer.invoke("profiles-delete", id);
      }
    }
  },
  api: {
    receive: (channel, func) => {
      let validChannels = ["profile-enabled"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    twitch: {
      async auth() {
        return await ipcRenderer.invoke("twitch-auth-request");
      },
      async disconnect() {
        return await ipcRenderer.invoke("twitch-auth-cancel");
      },
      async getRewards() {
        return await ipcRenderer.invoke("twitch-list-rewards");
      },
      getImageUrlScales : {"x1": 1, "x2": 2, "X4": 4},
      async getImageUrl({reward, scale}){
        return await ipcRenderer.invoke("twitch-get-reward-image-url", {reward, scale});
      },
      async createReward(reward) {
        return await ipcRenderer.invoke("twitch-create-reward", reward);
      },
      async updateReward(reward) {
        return await ipcRenderer.invoke("twitch-update-reward", reward);
      }
    },
    vtubeStudio: {
      async status() {
        return await ipcRenderer.invoke("vtube-status");
      },
      async updateStatus(data) {
        return await ipcRenderer.invoke("vtube-status-update", data);
      },
      authenticate() {
        return new Promise((resolve, reject) => {
          ipcRenderer.send("vtube-auth");
          ipcRenderer.on("vtube-auth-reply", (e, arg) => {
            if (arg.ok) {
              return resolve(arg);
            }
            return reject(arg.message);
          });
        })
      },
      async connect() {
        return new Promise((resolve, reject) => {
          ipcRenderer.send("vtube-connect");
          ipcRenderer.on("vtube-connect-reply", (e, arg) => {
            if (arg.ok) {
              return resolve(arg);
            }
            return reject(arg.message);
          });
        })
      },
      async list() {
        return new Promise((resolve, reject) => {
          ipcRenderer.send("vtube-list");
          ipcRenderer.on("vtube-list-reply", (e, arg) => {
            if (arg.ok) {
              return resolve(arg);
            }
            return reject(arg.message);
          });
        })
      },
      async hotkeys(modelID){
        return new Promise((resolve, reject) => {
          ipcRenderer.send("vtube-hotkeys", modelID);
          ipcRenderer.on("vtube-hotkeys-reply", (e, arg) => {
            if (arg.ok) {
              return resolve(arg);
            }
            return reject(arg.message);
          });
        })        
      },
      async select(id) {
        return new Promise((resolve, reject) => {
          ipcRenderer.send("vtube-select", id);
          ipcRenderer.on("vtube-select-reply", (e, arg) => {
            if (arg.ok) {
              return resolve(arg);
            }
            return reject(arg.message);
          });
        })
      }
    }
  }
});