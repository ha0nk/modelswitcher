import './App.scss';
import { useEffect, useState } from 'react';
import { Profile } from './components/profile';
import { VtubeStudioStatus } from './components/vtubeStudioStatus';

function App() {
  const profiles = window.electron.profiles;
  const api = window.electron.api;
  const [allProfiles, setAllProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [currentlyEditingProfile, setCurrentlyEditingProfile] = useState(null);
  const [vtubeStatus, setVtubeStatus] = useState({});
  const [vtubeModels, setVtubeModels] = useState([]);

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
    const result = await api.vtubeStudio.updateStatus({...vtubeStatus, ...data});
    setVtubeStatus(result);
  }

  const authenticateVtube = async () => {
    try{
      const result = await api.vtubeStudio.authenticate();
      if (result.ok){
        setVtubeStatus(result.data);
      }
    }catch(e){
      console.log(e.message);
    }
  }
  
  const connectVtube = async () => {
    try{
      const result = await api.vtubeStudio.connect();
      setVtubeStatus(result.data);
      const vtubeModelList = await api.vtubeStudio.list();
      console.log('vtube model list', vtubeModelList);
      setVtubeModels(vtubeModelList.data);
    }
    catch(e){
      if(e.message === "Vtube Studio Needs Authentication"){
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

  const renderProfile = (p, i) => <Profile key={i}
    availableModels={vtubeModels}
    onSave={editProfile}
    profile={p}
    isEditingGlobal={currentlyEditingProfile !== null}
    onEditing={setCurrentlyEditingProfile}
    onDelete={deleteProfile}
    onEnable={switchEnabledProfile}
    isEditingTarget={currentlyEditingProfile == p.id} />

  return (
    <div className="App">
      <h2>
        Create A Profile
      </h2>
      <input value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} /> <button onClick={createNewProfile}>Create</button>
      <h2> Current Profiles </h2>
      <div className={"profiles"}>
        {allProfiles.map(renderProfile)}
      </div>
      <VtubeStudioStatus onAuthenticate={authenticateVtube}
        onConnect={connectVtube}
        onChange={updateVtubeStatus}
        {...vtubeStatus} />
    </div>
  );
}

export default App;
