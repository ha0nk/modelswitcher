import { Button, Stack, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { _profiles, _twitchConnected, _twitchRewards, _vtubeModels, _vtubeStatus } from "../../atoms";
import { Profile } from "./profile";

export const Profiles = () => {
  const api = window.electron.api;
  const profiles = window.electron.profiles;
  const [allProfiles, setAllProfiles] = useRecoilState(_profiles);
  const [newProfileName, setNewProfileName] = useState("");
  const [currentlyEditingProfile, setCurrentlyEditingProfile] = useState(null);
  const vtubeStatus = useRecoilValue(_vtubeStatus);
  const twitchAuth = useRecoilValue(_twitchConnected);
  const [twitchRewards, setTwitchRewards] = useRecoilState(_twitchRewards);
  const [vtubeModels, setVtubeModels] = useRecoilState(_vtubeModels);

  useEffect(() => {
    async function setup() {
      const profilesExist = await profiles.exist();
      if (!profilesExist) {
        await profiles.setup();
      }
      const currentProfiles = await profiles.get();
      setAllProfiles(currentProfiles);
    }
    if (allProfiles === null) {
      setup();
    }
    api.receive("profile-enabled", (e) => {
      console.log("Profile enabled remotely: " + e);
      switchEnabledProfile(e);
    })
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getRewards() {
      if (twitchAuth && !twitchRewards) {
        const result = await api.twitch.getRewards();
        setTwitchRewards(result);
        console.log(result);
      }
    }
    getRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitchAuth]);
  useEffect(() => {
    getModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vtubeStatus, vtubeModels])

  const getModels = async () => {
    if (vtubeStatus.connected && (!vtubeModels || vtubeModels.length === 0)) {
      const vtubeModelList = await api.vtubeStudio.list();
      setVtubeModels(vtubeModelList.data);
    }
  }
  const editProfileMain = async (newVersion) => {
    return await profiles.profile.set(newVersion);
  }

  const switchEnabledProfile = async (id) => {
    allProfiles.forEach(async (p) => {
      if (p.id === id) {
        await editProfileMain({ ...p, enabled: true });
      } else {
        await editProfileMain({ ...p, enabled: false });
      }
    })
    var currentProfiles = await profiles.get();
    setAllProfiles(currentProfiles);
  }

  const createNewProfile = async () => {
    if (newProfileName.length > 0 && !allProfiles.find(v => v.name === newProfileName)) {
      const newName = newProfileName;
      setNewProfileName("");
      const success = await profiles.profile.set({ name: newName });
      if (success) {
        var currentProfiles = await profiles.get();
        setAllProfiles(currentProfiles);
      }
    }
  }

  const editProfile = async (newVersion) => {
    const success = await editProfileMain(newVersion);
    if (success) {
      var currentProfiles = await profiles.get();
      setAllProfiles(currentProfiles);
    }
  }

  const deleteProfile = async (id) => {
    const success = await profiles.profile.delete(id);
    if (success) {
      var currentProfiles = await profiles.get();
      setAllProfiles(currentProfiles);
    }
  }

  const addTwitchReward = async (reward, profile) => {
    const resReward = await api.twitch.createReward(reward)
    await editProfile({ ...profile, rewards: [profile.rewards, ...resReward] });
  }
  const updateTwitchReward = async (reward, profile) => {
    const resReward = await api.twitch.updateReward(reward)
    await editProfile({ ...profile, rewards: [profile.rewards.filter(r => r.id !== resReward.id), ...reward] });
  }

  const renderProfile = (p, i) => <Profile key={i}
    onReloadModels={getModels}
    availableRewards={twitchRewards}
    onTwitchRewardAdd={addTwitchReward}
    onTwitchRewardUpdate={updateTwitchReward}
    availableModels={vtubeModels}
    onSave={editProfile}
    profile={p}
    isEditingGlobal={currentlyEditingProfile !== null}
    onEditing={setCurrentlyEditingProfile}
    onDelete={deleteProfile}
    onEnable={switchEnabledProfile}
    isEditingTarget={parseInt(currentlyEditingProfile) === parseInt(p.id)} />

  return (<Fragment>
    <h2>
      Create A Profile
    </h2>
    <Stack spacing={2} sx={{ mb: 2 }} className={"profiles"}>
      <TextField variant="filled" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} />
      <Button disabled={newProfileName.length === 0} color="grey" variant="outlined" onClick={createNewProfile}>Create</Button>
    </Stack>
    <h2> Current Profiles </h2>
    <Stack spacing={2} sx={{ mb: 2 }} className={"profiles"}>
      {allProfiles && allProfiles.map(renderProfile)}
    </Stack>
  </Fragment>)
}