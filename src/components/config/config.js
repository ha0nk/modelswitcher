
import { Stack } from '@mui/material';
import { Fragment } from 'react';
import { Twitch } from './twitch';
import { VtubeStudio } from './vtubeStudio';

export const Config = ({vtubeStatus, setVtubeStatus, twitchAuth, setTwitchAuth, connectVtube}) => {
  const api = window.electron.api;
  
  const authenticateTwitch = async () => {
    try {
      const result = await api.twitch.auth();
      setTwitchAuth(result);
    }
    catch (e) {
      console.log(e.message);
    }
  }
  const disconnectTwitch = async () => {
    try {
      const result = await api.twitch.disconnect();
      setTwitchAuth({error: "disconnected"});
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
  const updateVtubeStatus = async (data) => {
    try {
      const result = await api.vtubeStudio.updateStatus({ ...vtubeStatus, ...data });
      setVtubeStatus(result);
    } catch (e) {
      console.log(e.message);
    }
  }

  return (<Fragment>
    <Stack spacing={2}>
      <Twitch isAuthenticated={!twitchAuth.error} onAuthenticate={authenticateTwitch} onDisconnect={disconnectTwitch} />
      <VtubeStudio onAuthenticate={authenticateVtube}
        onConnect={connectVtube}
        onChange={updateVtubeStatus}
        {...vtubeStatus} />
    </Stack>
  </Fragment>)
}