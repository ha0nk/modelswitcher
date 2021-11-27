import './App.scss';
import { useEffect, useState } from 'react';
import { Profile } from './components/profile';
import { VtubeStudioStatus } from './components/vtubeStudioStatus';
import { BottomNavigation, Button, Stack, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    grey: {
      main: '#383736',
      contrastText: '#fff',
    },
    green: {
      main: '#00d300',
      contrastText: '#fff'
    }
  },
});
function App() {
  const profiles = window.electron.profiles;
  const api = window.electron.api;
  const [allProfiles, setAllProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [currentlyEditingProfile, setCurrentlyEditingProfile] = useState(null);
  const [vtubeStatus, setVtubeStatus] = useState({});
  const [vtubeModels, setVtubeModels] = useState([]);
  const [twitchRewards, setTwitchRewards] = useState([]);
  const [twitchAuth, setTwitchAuth] = useState({});

  useEffect(() => {
    async function setup() {
      const currentVtubeStatus = await api.vtubeStudio.status();
      setVtubeStatus(currentVtubeStatus);
      const profilesExist = await profiles.exist();
      if (!profilesExist) {
        await profiles.setup();
      }
      const currentProfiles = await profiles.get();
      setAllProfiles(currentProfiles);
    }
    setup();
    api.receive("profile-enabled", (e) => {
      console.log("Profile enabled remotely: " + e);
      switchEnabledProfile(e);
    })
    // eslint-disable-next-line
  }, []);

  const updateVtubeStatus = async (data) => {
    try {
      const result = await api.vtubeStudio.updateStatus({ ...vtubeStatus, ...data });
      setVtubeStatus(result);
    } catch (e) {
      console.log(e.message);
    }
  }

  // useEffect(() => {
  //   async function get(){
  //     debugger;
  //     if (twitchAuth){
  //       const result = await api.twitch.getRewards();
  //       setTwitchRewards(result);
  //       console.log(result);
  //     }
  //   }
  //   get();
  // }, [twitchAuth])

  const getTwitchRewards = async() =>{
    if (twitchAuth){
            const result = await api.twitch.getRewards();
            setTwitchRewards(result);
            console.log(result);
          }else{
            setTwitchRewards(["not connected lul"])
          }
  }
  const disconnectTwitch = async() => {
    try{
      const result = await api.twitch.disconnect();
      setTwitchAuth(result);
    }
    catch(e) {
      console.log(e.message);
    }
  }
  const authenticateTwitch = async () => {
    try {
      const result = await api.twitch.auth();
      setTwitchAuth(result);
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const authenticateVtube = async () => {
    try {
      const result = await api.vtubeStudio.authenticate();
      if (result.ok) {
        setVtubeStatus(result.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const connectVtube = async () => {
    try {
      const result = await api.vtubeStudio.connect();
      setVtubeStatus(result.data);
      const vtubeModelList = await api.vtubeStudio.list();
      setVtubeModels(vtubeModelList.data);
    }
    catch (e) {
      if (e.message === "Vtube Studio Needs Authentication") {
        setVtubeStatus(e.data);
      }
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
  
  const addTwitchReward = async (reward, profile) =>{
    const resReward = await api.twitch.createReward(reward)
    await editProfile({...profile, rewards: [profile.rewards, ...resReward]});
  }
  const updateTwitchReward = async (reward, profile)=>{
    const resReward = await api.twitch.updateReward(reward)
    await editProfile({...profile, rewards: [profile.rewards.filter(r => r.id !== resReward.id), ...reward]});
  }

  const renderProfile = (p, i) => <Profile key={i}
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

  return (<ThemeProvider theme={theme} >

    <div className="App">
      <Button onClick={authenticateTwitch}>Test twitch auth</Button>
      <Button onClick={getTwitchRewards}>Get twitch rewards : {JSON.stringify(twitchRewards)}</Button>
      <Button onClick={disconnectTwitch}>Break auth</Button>
      <h2>
        Create A Profile
      </h2>
      <TextField variant="filled" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} /> <Button color="grey" variant="outlined" onClick={createNewProfile}>Create</Button>
      <h2> Current Profiles </h2>
      <Stack spacing={2} className={"profiles"}>
        {allProfiles.map(renderProfile)}
      </Stack>
      <VtubeStudioStatus onAuthenticate={authenticateVtube}
        onConnect={connectVtube}
        onChange={updateVtubeStatus}
        {...vtubeStatus} />
    </div>
    <BottomNavigation>

    </BottomNavigation>
  </ThemeProvider >
  );
}

export default App;
