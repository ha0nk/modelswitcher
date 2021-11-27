import { useState } from "react";
import { Reward } from "./reward"

export const Rewards = ({ rewards, isEditing, availableRewards, onTwitchRewardAdd, onTwitchRewardUpdate, ...rewardFunctions }) => {
  const [newReward, setNewReward] = useState(null);

  const createReward = async () => {
    await onTwitchRewardAdd(newReward);
  }

  const editReward = async () => {
    await onTwitchRewardUpdate(newReward);
  }

  const renderReward = (r, i) => <Reward key={i} editing={isEditing} reward={r} allRewards={availableRewards} {...rewardFunctions} />

  return (<div>
    <h4>Twitch Rewards</h4>
    <div className="profile-row-list grey">{rewards && rewards.map(renderReward)}</div>
  </div>)
}