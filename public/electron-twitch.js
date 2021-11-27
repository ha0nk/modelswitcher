
const { ElectronAuthProvider } = require('@twurple/auth-electron');
const { ApiClient } = require('@twurple/api');

class ElectronTwitch {
  authProvider;
  client;
  user;
  authTwitch = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const clientId = 'bld8xqw2miqkoly48x7g6cxdcfw7bj';
        const redirectUri = 'http://localhost/callback';
        this.authProvider = new ElectronAuthProvider({
          clientId,
          redirectUri
        });
        this.client = new ApiClient({
          authProvider: this.authProvider
        });
        await this.client.requestScopes(['channel:manage:redemptions']);
        this.user = await this.client.getTokenInfo();
        console.log("Sucessful authentication", this.user.userId);
        return resolve(this.user);
      } catch (e) {
        return reject(e);
      }
    })
  }
  cancelAuthTwitch = () => {
    this.authProvider.allowUserChange();
  }
  getRewards = async () => {
    return await this.client.channelPoints.getCustomRewards(this.user.userId, true);
  }
  createReward = async(e, reward) => {
    return {};
  }
  updateReward = async(e, reward) => {
    return {};
  }

}

module.exports = ElectronTwitch;