import { Fragment, useState } from "react"
import { RewardsList } from "../rewards/rewardsList";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

export const Profile = ({ profile, onSave, onDelete, onEnable, onEditing, isEditingGlobal = false, availableModels, availableRewards, ...rewardFunctions }) => {
  const [isEditing, setEditing] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);

  const setCurrentlyEditing = (value) => {
    setEditing(value);
    if (value === true) {
      onEditing(profile.id);
    } else {
      onEditing(null);
    }
  }
  const revertEdit = () => {
    setEditingName(profile.name);
    setCurrentlyEditing(false);
  }
  const setEnabled = () => {
    onEnable(profile.id);
  }
  const selectModel = (e) => {
    const model = availableModels.find(m => m.modelID === e.target.value)
    console.log(e.target.value, model);
    onSave({ ...profile, model });
  }
  const renderModelSelect = () => <div>
    <select value={parseInt((profile.model || { modelID: "0" }).modelID)} onChange={selectModel}>
      {availableModels.length > 0 ? <option value={"0"}>--Select A Model--</option> : <option value={"0"}>--Please Refresh Your VTS Connection--</option>}
      {availableModels.map((m, i) =>
        <option key={i} value={parseInt(m.modelID)}>{m.modelName}</option>)}
    </select>
  </div>

  const renderHotkeys = (h, i) => <div>hotkeeei</div>
  const renderStatus = () => <div className={`status ${profile.enabled ? 'enabled' : 'not-enabled'}`}></div>
  const renderStatic = () => <div>
    <div className={"profile-head"}>
      {renderStatus()}
      <h3>{profile.name}</h3>
    </div>
    <div className="space-elements-ten">
      {profile.enabled ? <Button color="grey" variant="outlined" disabled>Active</Button> : <Button variant="contained" color="green" className={"enable"} disabled={isEditingGlobal}
        onClick={() => setEnabled()}>Enable</Button>}
      <Button color="grey" variant="outlined" disabled={isEditingGlobal}
        onClick={() => setCurrentlyEditing(true)}>Edit</Button>
      <Button color="grey" variant="outlined" className={"delete"} onTransitionEnd={(e) => {
        if (e.nativeEvent.elapsedTime === 1 && !isDeleted) {
          setDeleted(true);
          onDelete(profile.id);
        }
      }}>Delete</Button>
    </div>
    <div>
      <h4>Model</h4>
      <div>{profile.model ? profile.model.modelName : "None Selected"}</div>
    </div>
    <div className="two-rows">
    <RewardsList rewards={profile.rewards} availableRewards={availableRewards} isEditing={isEditing} {...rewardFunctions}/>
      <div>
        <h4>Vtube Studio Hotkeys </h4>
        <div className="profile-row-list grey"> {profile.hotkeys && profile.hotkeys.map(renderHotkeys)}</div>
      </div>
    </div>
  </div>


  const renderEditing = () => <div>
    <div className={"profile-head"}>
      {renderStatus()}
      <TextField variant="filled" onChange={(e) => setEditingName(e.target.value)} defaultValue={editingName} />
    </div>
    <div className="space-elements-ten">
      <Button color="grey" variant="outlined" onClick={revertEdit}>Revert</Button>
      <Button color="grey" variant="outlined" onClick={() => {
        onSave({ ...profile, name: editingName });
        setCurrentlyEditing(false);
      }}>Save</Button>
    </div>
    <div>
      <h4>Model</h4>
      {renderModelSelect()}
    </div>
    <div className="two-rows">
      <RewardsList rewards={profile.rewards} availableRewards={availableRewards} isEditing={isEditing} {...rewardFunctions}/>
      <div>
        <h4>Vtube Studio Hotkeys </h4>
        <div className="profile-row-list grey"> {profile.hotkeys && profile.hotkeys.map(renderHotkeys)}</div>
      </div>
    </div>
    <div></div>
  </div>
  return (<Fragment>{isEditing ? renderEditing() : renderStatic()}</Fragment>)
}