import './App.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route, Link } from 'react-router-dom'
import { Profiles } from './components/profiles/profiles';
import { Config } from './components/config/config';
import { BottomNavigation, BottomNavigationAction, Paper, Box, CssBaseline, Badge } from '@mui/material';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faGrinHearts, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Rewards } from './components/rewards/rewards';
import { useRecoilState } from 'recoil';
import { _twitchConnected, _twitchRewards, _vtubeStatus } from './atoms';
import { Reward } from './components/rewards/reward';
import { Profile } from './components/profiles/profile';

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
  const api = window.electron.api;
  const [currentPage, setCurrentPage] = useState("/");

  const [vtubeStatus, setVtubeStatus] = useRecoilState(_vtubeStatus);
  const [twitchAuth, setTwitchAuth] = useRecoilState(_twitchConnected);
  const [twitchRewards, setTwitchRewards] = useRecoilState(_twitchRewards);

  useEffect(() => {
    async function getRewards() {
      try {
        if (twitchAuth && !twitchRewards) {
          const result = await api.twitch.getRewards();
          console.log("twitch rewards: " + result);
          setTwitchRewards(result);
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!vtubeStatus.connected) startVtubeConnect();
    if (!twitchAuth.error && !twitchRewards) getRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitchAuth]);

  useEffect(() => {
    console.log(vtubeStatus.connected, twitchAuth)
  }, [vtubeStatus, twitchAuth]);

  const startVtubeConnect = async () => {
    try {
      const result = await api.vtubeStudio.status();
      setVtubeStatus(result);
      if (result && result.authenticated) {
        await connectVtube();
      }
    } catch (e) {
      console.log(e);
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


  return (<ThemeProvider theme={theme} >
    <div className="App">
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden scroll", mb: 7 }}>
          <CssBaseline />
          <Routes>
            <Route exact path='/profiles' element={<Profiles />} />
            <Route path='/' element={<Config
              connectVtube={connectVtube} 
              vtubeStatus={vtubeStatus} setVtubeStatus={setVtubeStatus}
              twitchAuth={twitchAuth} setTwitchAuth={setTwitchAuth} />} />
            <Route path='/rewards' element={<Rewards />} />
            <Route path="/reward">
              <Route path=":id" element={<Reward />} />
              <Route path="" element={<Reward />} />
          </Route>
            <Route path="/profile">
              <Route path=":id" element={<Profile />} />
              <Route path="" element={<Profile />} />
          </Route>
          </Routes>
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentPage}
            onChange={(e, v) => {
              setCurrentPage(v);
            }}>
            <BottomNavigationAction disabled={!vtubeStatus.connected || twitchAuth.error} component={Link} to="/profiles" label="Profiles" icon={<FontAwesomeIcon icon={faUsers} />} />
            <BottomNavigationAction disabled={!vtubeStatus.connected || twitchAuth.error} component={Link} to="/rewards" label="Rewards" icon={<FontAwesomeIcon icon={faGrinHearts} />} />
            <BottomNavigationAction component={Link} to="/" label="Config" icon={<Badge invisible={vtubeStatus.connected
             && !twitchAuth.error} variant="dot" color="error">
              <FontAwesomeIcon icon={faCog}/>
            </Badge>} />
          </BottomNavigation>
        </Paper>
    </div>
  </ThemeProvider >
  );
}

export default App;
