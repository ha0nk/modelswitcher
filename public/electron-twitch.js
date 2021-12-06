
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
        await this.authProvider.getAccessToken(['channel:manage:redemptions']);
        this.client = new ApiClient({
          authProvider: this.authProvider
        });
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
    await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    return await this.client.channelPoints.getCustomRewards(this.user.userId, true);
  }
  createReward = async (e, reward) => {
    await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    return await this.client.channelPoints.createCustomReward(this.user.userId, reward);
  }
  updateReward = async (e, reward) => {
    await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    return await this.client.channelPoints.updateCustomReward(this.user.userId, reward.id, reward);
  }

}

module.exports = ElectronTwitch;