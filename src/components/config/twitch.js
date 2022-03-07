import { Button } from "@mui/material"
import { useEffect } from "react"

export const Twitch = ({ isAuthenticated, onAuthenticate, onDisconnect }) => {
  return (<div>
    <div className="head"><div className={`status ${isAuthenticated ? 'enabled' : 'not-enabled'}`}></div><h4>Twitch Connection</h4></div>
    <Button disabled={isAuthenticated} variant="outlined" color="grey" onClick={onAuthenticate}>Grant authentication</Button>
    <Button disabled={!isAuthenticated} variant="outlined" color="grey" onClick={onDisconnect}>Revoke Authentication</Button>
  </div>)
}