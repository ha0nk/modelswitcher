import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FormControlLabel, FormGroup, IconButton, Stack, Switch, TextField, Tooltip } from "@mui/material";
import { Fragment, useState } from "react";
import { Reward } from "./reward";
import { HexColorPicker } from "react-colorful";


export const RewardsManager = ({ rewards, isEditing, availableRewards, onTwitchRewardAdd, onTwitchRewardUpdate, ...rewardFunctions }) => {
  const newRewardDefault = {
    background_color: "#8b8b8b",
    is_max_per_user_per_stream_enabled: false,
    max_per_user_per_stream: 0,
    is_max_per_stream_enabled: false,
    max_per_stream: 0,
    is_global_cooldown_enabled: false,
    global_cooldown_seconds: 0,
    should_redemptions_skip_request_queue: false

  };
  const [newReward, setNewReward] = useState(newRewardDefault);

  const createReward = async () => {
    const newRewardToCreate = { ...newReward };
    setNewReward(newRewardDefault)
    await onTwitchRewardAdd(newRewardToCreate);
  }

  const editReward = async () => {
    await onTwitchRewardUpdate(newReward);
  }

  const renderReward = (r, i) => <Reward key={i} editing={isEditing} reward={r} allRewards={availableRewards} {...rewardFunctions} />

  const renderCurrentRewards = () => <div>
    <Stack justifyContent="center" alignItems="center" spacing={1} direction="row"><h4>Modify Twitch Rewards</h4>
      <Tooltip title={"Rewards must be created through Modelswitcher."}>
        <span>
          <IconButton disabled size="small">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
    <div className="profile-row-list grey">{rewards && rewards.map(renderReward)}</div>
  </div>

  const renderCreateReward = () => <Fragment>
    <h4>Create Twitch Reward</h4>
    <Stack sx={{ paddingLeft: 2, paddingRight: 2 }} spacing={2}>
      <Stack spacing={2} direction="row">
        <TextField label="Reward Name" variant="filled" className={"title"} />
        <TextField label="Cost" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} variant="filled" className={"cost"} />
      </Stack>
      <TextField label="Description" helperText={"Optional"} variant="filled" className={"prompt"} />
      <div style={{ textAlign: "left" }}>Reward background color: </div>
      <div style={{ width: 200, height: 20, backgroundColor: newReward.background_color, borderBottom: "1px solid grey", marginBottom: 0, paddingBottom: 0 }} />
      <HexColorPicker style={{ marginTop: 0 }} color={newReward.background_color} onChange={(hex) => setNewReward({ ...newReward, background_color: hex })} />
      <Stack justifyContent="flex-start" spacing={2} >
        <FormGroup>
          <FormControlLabel label="Skip Reward Requests Queue" control={<Switch checked={newReward.should_redemptions_skip_request_queue} onChange={(e) => { setNewReward({ ...newReward, should_redemptions_skip_request_queue: e.target.checked }) }} className={"skip-queue"} />} />
        </FormGroup>
        <Stack spacing={2} direction="row">
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.max_per_user_per_stream} label="Max redeems per user per stream" variant="filled" className={"max-per-user-per-stream"} />
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.max_per_stream} label="Max redeems per stream" variant="filled" className={"max-per-stream"} />
          <TextField helperText={"To have no limit, set the value to 0"} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={newReward.global_cooldown_seconds} label="Global cooldown" variant="filled" className={"global-cooldown"} />
        </Stack>
      </Stack>
      <Button color="grey" variant="outlined" disabled={JSON.stringify(newReward) === JSON.stringify(newRewardDefault)}onClick={createReward}>Create New Reward</Button>
    </Stack>
  </Fragment>

  return (<Fragment>
    {renderCreateReward()}
    {renderCurrentRewards()}
  </Fragment>)
}