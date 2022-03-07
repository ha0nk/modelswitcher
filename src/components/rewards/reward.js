
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button, FormControlLabel, FormGroup, FormHelperText, Stack, Switch, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { _twitchRewards } from "../../atoms";
import { Header } from '../generic/header';

const emptyReward = {
  title: "", cost: 0,
  prompt: "", backgroundColor: "#8b8b8b",
  maxRedemptionsPerUserPerStream: 0,
  maxRedemptionsPerStream: 0,
  globalCooldown: 0,
  autoFulfill: false,
  userInputRequired: false,
  isEnabled: false
};

export const Reward = () => {
  const api = window.electron.api;
  let { id } = useParams();
  const [twitchRewards, setTwitchRewards] = useRecoilState(_twitchRewards);
  const [rewardValues, setRewardValues] = useState((id && twitchRewards) ? twitchRewards.find(r => r.id === id) : emptyReward);
  const navigate = useNavigate();

  const editReward = async () => {
    try {
      const result = await api.twitch.updateReward(rewardValues);
      setTwitchRewards([...(twitchRewards || []).filter(r => r.id !== result.id), result]);
    } catch (e) {
      console.log(e)
    }
  }

  const createReward = async () => {
    try {
      console.log("HWAOWNK")
      const result = await api.twitch.createReward(rewardValues);
      setTwitchRewards([...(twitchRewards || []).filter(r => r.id !== result.id), result]);
      navigate(`/rewards`);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    console.log(rewardValues)
  },[rewardValues])

  return (<Fragment>
    <Header buttonImage={faArrowLeft} onButtonClick={() => navigate(`/rewards`)}
    >{!!rewardValues.id ? "Edit Twitch Reward" : "Create Twitch Reward"}
    </Header>
    <Stack sx={{ padding: 2 }} spacing={2}>
      <Stack spacing={2} direction="row">
        <TextField value={rewardValues.title} onChange={(e) => setRewardValues({ ...rewardValues, title: e.target.value })}
          label="Reward Name" variant="filled" className={"title"} inputProps={{ maxLength: 45 }} />
        <TextField value={rewardValues.cost} onChange={(e) => setRewardValues({ ...rewardValues, cost: parseInt(e.target.value) })}
          label="Cost" type="text" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} variant="filled" className={"cost"} />
      </Stack>
      <TextField label="Description" helperText={"Optional"} variant="filled" className={"prompt"}
        value={rewardValues.prompt} onChange={(e) => setRewardValues({ ...rewardValues, prompt: e.target.value })}
        inputProps={{ maxLength: 200 }} />
      <div style={{ textAlign: "left" }}>Reward background color: </div>
        <FormHelperText>Reward icons cannot be edited through Modelswitcher and need to be adjusted in your dashboard.</FormHelperText>
      <div style={{ width: 200, height: 20, backgroundColor: rewardValues.backgroundColor, borderBottom: "1px solid grey", marginBottom: 0, paddingBottom: 0 }} />
      <HexColorPicker style={{ marginTop: 0 }} color={rewardValues.backgroundColor} 
      onChange={(hex) => setRewardValues({ ...rewardValues, backgroundColor: hex })} />
      <Stack justifyContent="flex-start" spacing={2} >
        <FormGroup>
          <FormControlLabel label="Skip Reward Requests Queue" 
          control={<Switch checked={rewardValues.autoFulfill} 
          onChange={(e) => { setRewardValues({ ...rewardValues, autoFulfill: e.target.checked }) }} className={"skip-queue"} />} />
        </FormGroup>
        <FormHelperText>For no redemption limit or global cooldowns, set the values below to 0 or empty.</FormHelperText>
        <Stack spacing={2} direction="row">
          <TextField  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={rewardValues.maxRedemptionsPerUserPerStream} label="Max redeems per user per stream" variant="filled" 
            onChange={(e) => setRewardValues({ ...rewardValues, maxRedemptionsPerUserPerStream: parseInt(e.target.value) })} />
          <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={rewardValues.maxRedemptionsPerStream} label="Max redeems per stream" variant="filled"
            onChange={(e) => setRewardValues({ ...rewardValues, imaxRedemptionsPerStream: parseInt(e.target.value) })} />
          <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={rewardValues.globalCooldown} label="Global cooldown" variant="filled"
            onChange={(e) => setRewardValues({ ...rewardValues, globalCooldown: parseInt(e.target.value) })} />
        </Stack>
      </Stack>
      <Button color="grey" variant="outlined" disabled={JSON.stringify(rewardValues) === JSON.stringify(emptyReward)} 
      onClick={!!rewardValues.id ? editReward : createReward}>{rewardValues.id ? "Edit Reward" : "Create New Reward"}</Button>
    </Stack>
  </Fragment>)
}