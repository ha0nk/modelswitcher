
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
        this.user = await this.client.users.getMe();
        console.log("Sucessful twitch authentication", this.user.displayName);
        return resolve(this.user);
      } catch (e) {
        return reject(e);
      }
    })
  }
  cancelAuthTwitch = () => {
    this.authProvider.allowUserChange();
  }
  //context-bridge doesn't allow you to pass complex objects this took SO LONG TO SOLVE :,,,o)
  //https://www.electronjs.org/docs/latest/api/context-bridge#parameter--error--return-type-support
  mapReward = r => ({
    title: r.title,
    cost: r.cost,
    prompt: r.prompt,
    backgroundColor: r.backgroundColor,
    maxRedemptionsPerUserPerStream: r.maxRedemptionsPerUserPerStream,
    maxRedemptionsPerStream: r.maxRedemptionsPerStream,
    globalCooldown: r.globalCooldown,
    autoFulfill: r.autoFulfill,
    userInputRequired: r.userInputRequired,
    isEnabled: r.isEnabled})
    
  getRewards = async () => {
    // await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    var result =  await this.client.channelPoints.getCustomRewards(this.user.id, true);
    console.log("Available Rewards: ", result);
    return result.map(this.mapReward);
  }
  createReward = async (e, reward) => {
    // await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    var result = await this.client.channelPoints.createCustomReward(this.user.id, reward);
    console.log("New Reward: ", result);
    return this.mapReward(result);
  }
  updateReward = async (e, reward) => {
    // await this.authProvider.getAccessToken(['channel:manage:redemptions']);
    var result =  this.client.channelPoints.updateCustomReward(this.user.id, reward.id, reward);
    console.log("Updated Reward: ", result);
    return this.mapReward(result);
  }

}

module.exports = ElectronTwitch;