import { IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { _vtubeHotkeys } from "../../atoms";
import { Hotkey } from "./hotkey"
import { Reload } from "../generic/reload";
import { Dropdown } from "../generic/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Tip } from "../generic/tip";

//make idk dropdown to select hotkey with + beside it to add to list, all hotkeys on list have - to remove
//if a hotkey is on the list, it's enabled when the profile is activated, and disabled when the profile is no longer active
export const HotkeysList = ({ hotkeys = [], isEditing = false, modelID, onHotkeyListUpdate = () => { } }) => {
  const api = window.electron.api;
  const [availableHotkeys, setAvailableHotkeys] = useRecoilState(_vtubeHotkeys(modelID));
  const [currentSelectedNewHotkey, setCurrentSelectedNewHotkey] = useState({ hotkeyID: "0" });

  useEffect(() => {
    if (availableHotkeys.length === 0) {
      getHotkeys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableHotkeys]);

  useEffect(() => {
    getHotkeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelID]);

  //need reload button for after u add a hotkey in vts
  const getHotkeys = async () => {
    if (isEditing) {
      const vtubeModelHotkeys = await api.vtubeStudio.hotkeys(modelID);
      setAvailableHotkeys(vtubeModelHotkeys.data);
    }
  }

  const removeHotkey = async (hotkey) => {
    const newHotkeyList = [...hotkeys.filter(r => r.id !== hotkey.id)];
    await onHotkeyListUpdate(newHotkeyList);
  }

  const addHotkey = async () => {
    debugger;
    const newHotkeyList = [...hotkeys, { ...currentSelectedNewHotkey, modelID }];
    await onHotkeyListUpdate(newHotkeyList);
    setCurrentSelectedNewHotkey({ hotkeyID: "0" });
  }

  const selectNewHotkey = (e) => {
    setCurrentSelectedNewHotkey(availableHotkeys.find(h => h.hotkeyID === e.target.value));
  }

  const renderHotkeySelect = () => <Stack direction="horizontal">
    <Dropdown
      disabled={!modelID}
      value={currentSelectedNewHotkey.hotkeyID}
      onChange={selectNewHotkey}
      title={"Add Hotkey"}
      items={!modelID ? [{ value: "0", name: "--Please select a Model--" }] :
        availableHotkeys.filter(h => !hotkeys.find(ph => ph.hotkeyID === h.hotkeyID)).map(h => ({ value: h.hotkeyID, name: h.name }))
      } />
    <IconButton onClick={addHotkey} disabled={currentSelectedNewHotkey === { hotkeyID: "0" }} >
      <FontAwesomeIcon icon={faPlus} />
    </IconButton>
  </Stack>

  return (<Stack spacing={2} sx={{ mb: 2 }}>
    <Stack justifyContent="center" spacing={2} direction="horizontal">
      <Stack justifyContent="center" alignItems="center" spacing={1} direction="row"><h4>Vtube Studio Hotkeys</h4>
        <Tip text="Hotkeys  will be turned on when profile is active, and off when profile is inactive." />
      </Stack> {isEditing && <Reload disabled={!modelID} onClick={getHotkeys} />}</Stack>
    <Stack spacing={2} sx={{ pb: 2, pt: 2 }} className="profile-row-list grey">{hotkeys.map((r, i) => <Hotkey key={i} isEditing={isEditing} hotkey={r} />)}</Stack>
    {isEditing && availableHotkeys && <div> {renderHotkeySelect()}</div>}
  </Stack>)
}