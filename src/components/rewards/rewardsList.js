import { Reward } from "./reward"

//make idk dropdown to select reward with + beside it to add to list, all rewards on list have - to remove
//if a reward is on the list, it's enabled when the profile is activated, and disabled when the profile is no longer active
export const RewardsList = ({ rewards, isEditing, availableRewards, onRewardListUpdate}) => {

  const removeReward = async (reward) => {
    const newRewardList = {...rewards.filter(r=> r.id !== reward.id)}
    await onRewardListUpdate(newRewardList);
  }
  const addReward = async (reward) => {
    const newRewardList = {...rewards, reward}
    await onRewardListUpdate(newRewardList);
  }

  const renderReward = (r, i) => <Reward key={i} editing={isEditing} reward={r} allRewards={availableRewards} />

  return (<div>
    <h4>Twitch Rewards</h4>
    <div className="profile-row-list grey">{rewards && rewards.map(renderReward)}</div>
  </div>)
}