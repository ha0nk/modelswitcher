import { Button, FormControlLabel, FormGroup, Stack, Switch, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Reward } from "./reward";
import { HexColorPicker } from "react-colorful";
import { Tip } from "../generic/tip";
import { useRecoilState, useRecoilValue } from "recoil";
import { _twitchConnected, _twitchRewards } from "../../atoms";


export const RewardsManager = () => {
  const api = window.electron.api;
  const [twitchRewards, setTwitchRewards] = useRecoilState(_twitchRewards);
  const twitchAuth = useRecoilValue(_twitchConnected);

  useEffect(() => {
    async function getRewards() {
     try{
      if (twitchAuth && !twitchRewards) {
        const result = await api.twitch.getRewards();
        setTwitchRewards(result);
        console.log(result);
      }
     }catch(e){
       console.log(e)
     }
    }
    getRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitchAuth]);

  const newRewardDefault = {
    title: "",
    cost: 0,
    prompt: "",
    backgroundColor: "#8b8b8b",
    maxRedemptionsPerUserPerStream: 0,
    maxRedemptionsPerStream: 0,
    globalCooldown: 0,
    autoFulfill: false,
    userInputRequired: false,
    isEnabled: false

  };
  const [newReward, setNewReward] = useState(newRewardDefault);

  const createReward = async () => {
    try {
      debugger;
      const newRewardToCreate = { ...newReward };
      setNewReward(newRewardDefault)
      const result = await api.twitch.createReward(newRewardToCreate);
      setTwitchRewards([...twitchRewards, result.data]);
    } catch (e) {
      console.log(e)
    }
  }

  const editReward = async () => {
    try {
      const newRewardToCreate = { ...newReward };
      setNewReward(newRewardDefault)
      const result = await api.twitch.updateReward(newRewardToCreate);
      setTwitchRewards([...twitchRewards, result.data]);
    } catch (e) {
      console.log(e)
    }
  }

  const renderReward = (r, i) => <Reward key={i} reward={r} />

  const renderCurrentRewards = () => <div>
    <Stack justifyContent="center" alignItems="center" spacing={1} direction="row"><h4>Modify Twitch Rewards</h4>
      <Tip text="Rewards must be created through Modelswitcher to be used in Modelswitcher." />
    </Stack>
    <div className="profile-row-list grey">{twitchRewards && twitchRewards.map(renderReward)}</div>
  </div>

  const renderCreateReward = () => <Fragment>
    <h4>Create Twitch Reward</h4>
    <Stack sx={{ paddingLeft: 2, paddingRight: 2 }} spacing={2}>
      <Stack spacing={2} direction="row">
        <TextField value={newReward.title} onChange={(e) => setNewReward({ ...newReward, title: e.target.value })} label="Reward Name" variant="filled" className={"title"} />
        <TextField value={newReward.cost} onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) })}  label="Cost" type="text" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} variant="filled" className={"cost"} />
      </Stack>
      <TextField label="Description" helperText={"Optional"} variant="filled" className={"prompt"} value={newReward.prompt} onChange={(e) => setNewReward({ ...newReward, prompt: e.target.value })} />
      <div style={{ textAlign: "left" }}>Reward background color: </div>
      <div style={{ width: 200, height: 20, backgroundColor: newReward.backgroundColor, borderBottom: "1px solid grey", marginBottom: 0, paddingBottom: 0 }} />
      <HexColorPicker style={{ marginTop: 0 }} color={newReward.backgroundColor} onChange={(hex) => setNewReward({ ...newReward, backgroundColor: hex })} />
      <Stack justifyContent="flex-start" spacing={2} >
        <FormGroup>
          <FormControlLabel label="Skip Reward Requests Queue" control={<Switch checked={newReward.autoFulfill} onChange={(e) => { setNewReward({ ...newReward, autoFulfill: e.target.checked }) }} className={"skip-queue"} />} />
        </FormGroup>
        <Stack spacing={2} direction="row">
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.maxRedemptionsPerUserPerStream} label="Max redeems per user per stream" variant="filled" className={"max-per-user-per-stream"}  value={newReward.maxRedemptionsPerUserPerStream} onChange={(e) => setNewReward({ ...newReward, maxRedemptionsPerUserPerStream: parseInt(e.target.value) })} />
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.maxRedemptionsPerStream} label="Max redeems per stream" variant="filled" className={"max-per-stream"}  value={newReward.maxRedemptionsPerStream} onChange={(e) => setNewReward({ ...newReward, imaxRedemptionsPerStream: parseInt(e.target.value) })} />
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.globalCooldown} label="Global cooldown" variant="filled" className={"global-cooldown"}  value={newReward.globalCooldown} onChange={(e) => setNewReward({ ...newReward, globalCooldown: parseInt(e.target.value) })} />
        </Stack>
      </Stack>
      <Button color="grey" variant="outlined" disabled={JSON.stringify(newReward) === JSON.stringify(newRewardDefault)} onClick={createReward}>Create New Reward</Button>
    </Stack>
  </Fragment>

  return (<Fragment>
    {renderCreateReward()}
    {renderCurrentRewards()}
  </Fragment>)
}