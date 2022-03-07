
const { ElectronAuthProvider } = require('@twurple/auth-electron');
const { ApiClient } = require('@twurple/api');

class ElectronTwitch {
  authProvider;
  client;
  user;
  rewards;
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
        return resolve({name: this.user.displayName, icon: this.user.profilePictureUrl});
      } catch (e) {
        return reject({error: e});
      }
    })
  }
  cancelAuthTwitch = () => {
    this.authProvider && this.authProvider.allowUserChange();
  }
  //context-bridge doesn't allow you to pass complex objects this took SO LONG TO SOLVE :,,,o)
  //https://www.electronjs.org/docs/latest/api/context-bridge#parameter--error--return-type-support
  mapReward = r => ({
    id: r.id,
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
    var result =  await this.client.channelPoints.getCustomRewards(this.user.id, true);
    console.log("Fetched Rewards");
    this.rewards = result;
    return result.map(this.mapReward);
  }
  createReward = async (e, reward) => {
    var result = await this.client.channelPoints.createCustomReward(this.user.id, reward);
    console.log("New Reward: ", result.title);
    return this.mapReward(result);
  }
  getRewardImageUrl = async (e, {reward, scale = 1}) => {
    var result = await this.rewards.find(r => r.id === reward.id).getImageUrl(scale); 
    return result;
  }
  updateReward = async (e, reward) => {
    console.log("Desired Reward Update:", reward)
    var result =  await this.client.channelPoints.updateCustomReward(this.user.id, reward.id, reward);
    console.log("Updated Reward: ", result.title);
    return this.mapReward(result);
  }

}

module.exports = ElectronTwitch;