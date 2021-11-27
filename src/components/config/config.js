
import { Stack } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { _twitchConnected, _vtubeStatus } from '../../atoms';
import { Twitch } from './twitch';
import { VtubeStudio } from './vtubeStudio';

export const Config = () => {
  const api = window.electron.api;
  const [vtubeStatus, setVtubeStatus] = useRecoilState(_vtubeStatus);
  const [twitchAuth, setTwitchAuth] = useRecoilState(_twitchConnected);

  useEffect(() => {
    if (!vtubeStatus) startVtubeConnect();
    if (!twitchAuth) authenticateTwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startVtubeConnect = async () => {
    try {
      const result = await api.vtubeStudio.status();
      setVtubeStatus(result);
      if (result && result.authenticated) {
        await connectVtube();
      }
    }catch(e){
      console.log(e);
    }
  }

  const disconnectTwitch = async () => {
    try {
      const result = await api.twitch.disconnect();
      setTwitchAuth(result);
    }
    catch (e) {
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
    }
    catch (e) {
      if (e.message === "Vtube Studio Needs Authentication") {
        setVtubeStatus(e.data);
      }
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
      <Twitch isAuthenticated={twitchAuth} onAuthenticate={authenticateTwitch} onDisconnect={disconnectTwitch} />
      <VtubeStudio onAuthenticate={authenticateVtube}
        onConnect={connectVtube}
        onChange={updateVtubeStatus}
        {...vtubeStatus} />
    </Stack>
  </Fragment>)
}