import { Stack } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { _twitchRewards } from "../../atoms";
import { Dropdown } from "../generic/dropdown";
import { Tip } from "../generic/tip";
import { Reward } from "./reward"

//make idk dropdown to select reward with + beside it to add to list, all rewards on list have - to remove
//if a reward is on the list, it's enabled when the profile is activated, and disabled when the profile is no longer active
export const RewardsList = ({ rewards = [], isEditing, onRewardListUpdate = () => {} }) => {
  const availableRewards = useRecoilValue(_twitchRewards);

  const removeReward = async (e) => {
    const reward = availableRewards.find(r => r.id === e.target.value);
    const newRewardList = [...rewards.filter(r => r.id !== reward.id)]
    await onRewardListUpdate(newRewardList);
  }
  const addReward = async (e) => {
    const reward = availableRewards.find(r => r.id === e.target.value);
    const newRewardList = [...rewards, reward]
    await onRewardListUpdate(newRewardList);
  }

  useEffect(() => {
    console.log(rewards)
  },[]);

  const renderReward = (r, i) => <Reward key={i} editing={isEditing} {...r} />

  const renderAddReward = () => <Fragment>
    {(availableRewards||[]).length > 0 ? <Dropdown
      onChange={addReward}
      title={"Select Reward"}
      value={"0"}
      items={[{ value: "0", name: "--Select A Reward--" }, ...availableRewards.filter(r=> !rewards.find(re => re.id === r.id)).map(m => ({ value: m.id, name: m.title }))]} />
      : <Dropdown disabled={true}
        title={"Select Reward"}
        value={"0"}
        items={[{ value: "0", name: "--Please create a reward--" }]} />}
  </Fragment>

  return (<Stack spacing={2} sx={{ mb: 2 }}>
    <Stack justifyContent="center" alignItems="center" spacing={1} direction="row"><h4>Twitch Rewards</h4>
      <Tip text="Rewards created through Modelswitcher will be turned on when profile is active, and off when profile is inactive." />
    </Stack>
    <Stack spacing={2} sx={{ pb: 2, pt: 2 }} className="profile-row-list grey">{rewards && rewards.map(renderReward)}</Stack>
    {isEditing && <div>{renderAddReward()}</div>}
  </Stack>)
}