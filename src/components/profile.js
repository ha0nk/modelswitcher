import { Fragment, useState } from "react"
import { Reward } from "./reward";

export const Profile = ({ profile, onSave, onDelete, onEnable, onEditing, isEditingGlobal = false, availableModels }) => {
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
    console.log('yas kwern')
    onEnable(profile.id);
  }
  const selectModel = (e) => {
    console.log(e.target.value);
  }
  const renderModelSelect = () => <div>
    <select value={(profile.model || {}).id}  onChange={selectModel}>
      <option value={undefined}>--Select A Model--</option>
      {availableModels.map(m =>
        <option value={m.modelID}>{m.modelName}</option>)}
    </select>
  </div>

  const renderReward = (r, i) => <Reward key={i} editing={isEditing} reward={r} />
  const renderStatus = () => <div className={`status ${profile.enabled ? 'enabled' : 'not-enabled'}`}></div>
  const renderStatic = () => <Fragment><div>
    <div className={"profile-head"}>
      {renderStatus()}
      <h3>{profile.name}</h3>
    </div>
    <div>
      <h4>Model</h4>
      {renderModelSelect()}
    </div>
    <div className="two-rows">
      <div>
          <h4>Twitch Rewards</h4>
          <div className="profile-row-list grey">{profile.rewards && profile.rewards.map(renderReward)}</div>
      </div>
      <div>
          <h4>Vtube Studio Hotkeys </h4>
          <div className="profile-row-list grey"> {profile.hotkeys && profile.hotkeys.map(renderReward)}</div>
      </div>
    </div>
    <div>
      {profile.enabled ? <button disabled>Active</button> : <button className={"enable"} disabled={isEditingGlobal}
        onClick={() => setEnabled()}>Enable</button>}
      <button disabled={isEditingGlobal}
        onClick={() => setCurrentlyEditing(true)}>Edit</button>
      <button className={"delete"} onTransitionEnd={(e) => {
        if (e.nativeEvent.elapsedTime === 1 && !isDeleted) {
          setDeleted(true);
          onDelete(profile.id);
        }
      }}>Delete</button>
    </div>
  </div>
  </Fragment >

  const renderEditing = () => <Fragment><div className={"profile-head"}>
    {renderStatus()}
    <input onChange={(e) => setEditingName(e.target.value)} defaultValue={editingName} />
    <div>
      {profile.rewards && profile.rewards.map(renderReward)}
    </div>
    <div><button>Create Reward</button></div>
    <div>
      <button onClick={revertEdit}>Revert</button>
      <button onClick={() => {
        onSave({ ...profile, name: editingName });
        setCurrentlyEditing(false);
      }}>Save</button>
    </div>
  </div>
  </Fragment>
  return (<Fragment>{isEditing ? renderEditing() : renderStatic()}</Fragment>)
}