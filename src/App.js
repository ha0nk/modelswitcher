import './App.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route, Link } from 'react-router-dom'
import {
  RecoilRoot
} from 'recoil';
import { Profiles } from './components/profiles/profiles';
import { Config } from './components/config/config';
import { BottomNavigation, BottomNavigationAction, Paper, Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faGrinHearts, faUsers } from '@fortawesome/free-solid-svg-icons';
import { RewardsManager } from './components/rewards/rewardsManager';

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
  const [currentPage, setCurrentPage] = useState("/");
  return (<ThemeProvider theme={theme} >
    <div className="App">
      <RecoilRoot>
          <Box sx={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden scroll", mb: 7}}>
            <CssBaseline />
            <Routes>
              <Route exact path='/' element={<Profiles />} />
              <Route path='/config' element={<Config />} />
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
      </RecoilRoot>
    </div>
  </ThemeProvider >
  );
}

export default App;
