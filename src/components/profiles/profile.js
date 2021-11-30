import { Fragment, useState } from "react"
import { RewardsList } from "../rewards/rewardsList";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { HotkeysList } from "../hotkeys/hotkeysList";
import { Dropdown } from "../generic/dropdown";
import { useRecoilValue } from "recoil";
import { _vtubeModels } from "../../atoms";
import { Reload } from "../generic/reload";

export const Profile = ({ profile, onSave, onDelete, onReloadModels, onEnable, onEditing, isEditingGlobal = false, ...rewardFunctions }) => {
  const [isEditing, setEditing] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);
  const availableModels = useRecoilValue(_vtubeModels);

  const onHotkeyListUpdate = (hotkeys) => {
    onSave({ ...profile, hotkeys });
  }
  const setCurrentlyEditing = (value) => {
    setEditing(value);
    if (value === true) {
      onEditing(profile.id);
    } else {
      onEditing(null);
    }
  }
  const setEnabled = () => {
    onEnable(profile.id);
  }
  const selectModel = (e) => {
    const model = availableModels.find(m => (m.modelID).toString() === e.target.value)
    console.log(e.target.value, model);
    onSave({ ...profile, model });
  }

  const renderModelSelect = () => <Fragment>
    {availableModels && availableModels.length > 0 ? <Dropdown
      onChange={selectModel}
      title={"Select Model"}
      value={((profile.model ? profile.model : { modelID: "0" }).modelID).toString()}
      items={[{ value: "0", name: "--Select A Model--" }, ...availableModels.map(m => ({ value: m.modelID, name: m.modelName }))]} />
      : <Dropdown disabled={true}
        title={"Select Model"}
        value={((profile.model ? profile.model : { modelID: "0" }).modelID).toString()}
        items={[{ value: "0", name: "--Please Refresh Your VTS Connection--" }]} />}
  </Fragment>

  const eligibleHotkeys = () => (profile.hotkeys || []).filter(h => h.modelID === (profile.model || {}).modelID)
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
      <RewardsList rewards={profile.rewards} isEditing={false} {...rewardFunctions} />
      <HotkeysList modelID={(profile.model || {}).modelID} hotkeys={eligibleHotkeys()} isEditing={false} />
    </div>
  </div>

  const renderEditing = () => <div>
    <div className={"profile-head"}>
      {renderStatus()}
      <TextField variant="filled" onChange={(e) => setEditingName(e.target.value)} defaultValue={editingName} />
    </div>
    <div className="space-elements-ten">
      <Button color="grey" variant="outlined" onClick={() => {
        onSave({ ...profile, name: editingName });
        setCurrentlyEditing(false);
      }}>Save</Button>
    </div>
    <div>
      <h4>Model <Reload onClick={onReloadModels} /></h4>
      {renderModelSelect()}
    </div>
    <div className="two-rows">
      <RewardsList rewards={profile.rewards} isEditing={true} {...rewardFunctions} />
      <HotkeysList modelID={(profile.model || {}).modelID} hotkeys={eligibleHotkeys()} isEditing={true} onHotkeyListUpdate={onHotkeyListUpdate} />
    </div>
    <div></div>
  </div>

  return (<Fragment>{isEditing ? renderEditing() : renderStatic()}</Fragment>)
}