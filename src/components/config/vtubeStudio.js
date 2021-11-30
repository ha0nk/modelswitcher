import _debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import TextField from '@mui/material/TextField';
import { Button, IconButton, Stack } from '@mui/material';
import { Reload } from '../generic/reload';

export const VtubeStudio = ({ onAuthenticate, onConnect, onChange, authenticated = false, connected = false, domain = "", port = "" }) => {
  const [waitingOnWebsocket, setWaiting] = useState(false);
  const debounceOnChange = _debounce(onChange, 1000);
  const onChangeDomain = (e) => {
    const value = isEmpty(e.target.value.trim()) ? "0.0.0.0" : e.target.value;
    debounceOnChange({ domain: isEmpty(e.target.value) ? "0.0.0.0" : e.target.value, port });
    e.target.value = value;
  }
  const onChangePort = (e) => {
    const value = isEmpty(e.target.value.trim()) ? "8081" : e.target.value;
    debounceOnChange({ domain, port: isEmpty(e.target.value) ? "8081" : e.target.value });
    e.target.value = value;
  }

  const isEmpty = (value) => value.length === 0

  const triggerAuthenticate = () => {
    setWaiting(true);
    onAuthenticate();
  }

  useEffect(() => {
    setWaiting(false);
  }, [authenticated, connected]);

  return (<div>
    <div className="head"><div className={`status ${connected ? 'enabled' : 'not-enabled'}`}></div><h4>Vtube Studio Connection</h4></div>
    <div>
      <p>These should match with the 'API address' in the Vtube Studio plugins panel.</p>
      <div className="two-rows">
        <TextField variant="filled" disabled={connected} onChange={onChangeDomain} value={domain} /><TextField variant="filled" disabled={connected} onChange={onChangePort} value={port} />
      </div>
    </div>
    <div>
      <Stack direction="row" spacing={2}
        justifyContent="center"
        alignItems="center" >
        <Button variant="outlined" color="grey" onClick={triggerAuthenticate} disabled={waitingOnWebsocket || authenticated}>{authenticated ? "Authenticated" : "Authenticate"}</Button>
        <Button variant="contained" color="green" onClick={onConnect} disabled={waitingOnWebsocket || connected || !authenticated} className={`${connected ? 'connected' : 'not-connected'}`}>{connected ? "Connected" : "Connect"}</Button>
        <Reload onClick={() => { connected && onConnect(); }} disabled={!connected} />
      </Stack>
    </div>
  </div>)

}