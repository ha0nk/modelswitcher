import _debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

export const VtubeStudioStatus = ({ onAuthenticate, onConnect, onChange, authenticated = false, connected = false, domain, port}) => {
  const [waitingOnWebsocket, setWaiting] = useState(false);
  const debounceOnChange = _debounce(onChange, 1000);
  const onChangeDomain = (e) => {
    const value = isEmpty(e.target.value.trim()) ? "0.0.0.0" : e.target.value;
    debounceOnChange({ domain: isEmpty(e.target.value) ? "0.0.0.0" : e.target.value, port });
    e.target.value = value;
  }
  const onChangePort = (e) => {
    const value = isEmpty(e.target.value.trim()) ? "8081" : e.target.value;
    debounceOnChange({ domain, port:isEmpty(e.target.value) ? "8081" : e.target.value });
    e.target.value = value;
  } 

  const isEmpty = (value) => value.length === 0

  const triggerAuthenticate = () =>{
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
      <input disabled={connected} onChange={onChangeDomain} defaultValue={domain} /><input disabled={connected} onChange={onChangePort} defaultValue={port} />
    </div>
    <div>
      <button onClick={triggerAuthenticate} disabled={waitingOnWebsocket || authenticated}>{authenticated? "Authenticated" : "Authenticate"}</button>
      <button onClick={onConnect} disabled={waitingOnWebsocket || connected || !authenticated} className={`${connected ? 'connected' : 'not-connected'}`}>{connected ? "Connected" : "Connect"}</button>
      <FontAwesomeIcon onClick={() => {connected && onConnect();}} className={`reconnect${connected ? ' clickable' : ''}`} icon={faSync} />
    </div>
  </div>)

}