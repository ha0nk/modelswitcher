import './App.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route, Link } from 'react-router-dom'
import { Profiles } from './components/profiles/profiles';
import { Config } from './components/config/config';
import { BottomNavigation, BottomNavigationAction, Paper, Box, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faGrinHearts, faUsers } from '@fortawesome/free-solid-svg-icons';
import { RewardsManager } from './components/rewards/rewardsManager';
import { useRecoilState } from 'recoil';
import { _twitchConnected, _vtubeStatus } from './atoms';

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

  useEffect(() => {
    if (!vtubeStatus.status ) startVtubeConnect();
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
  const authenticateTwitch = async () => {
    try {
      const result = await api.twitch.auth();
      setTwitchAuth(result);
    }
    catch (e) {
      console.log(e.message);
    }
  }

  return (<ThemeProvider theme={theme} >
    <div className="App">
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden scroll", mb: 7 }}>
          <CssBaseline />
          <Routes>
            <Route exact path='/' element={<Profiles />} />
            <Route path='/config' element={<Config
              connectVtube={connectVtube} authenticateTwitch={authenticateTwitch}
              vtubeStatus={vtubeStatus} setVtubeStatus={setVtubeStatus}
              twitchAuth={twitchAuth} setTwitchAuth={setTwitchAuth} />} />
            <Route path='/rewards' element={<RewardsManager />} />
          </Routes>
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentPage}
            onChange={(e, v) => {
              setCurrentPage(v);
            }}>
            <BottomNavigationAction component={Link} to="/" label="Profiles" icon={<FontAwesomeIcon icon={faUsers} />} />
            <BottomNavigationAction component={Link} to="/rewards" label="Rewards" icon={<FontAwesomeIcon icon={faGrinHearts} />} />
            <BottomNavigationAction component={Link} to="/config" label="Config" icon={<FontAwesomeIcon icon={faCog} />} />
          </BottomNavigation>
        </Paper>
    </div>
  </ThemeProvider >
  );
}

export default App;
