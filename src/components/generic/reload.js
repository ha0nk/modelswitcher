import { faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton } from "@mui/material"

export const Reload = ({onClick, disabled}) => {
  return (<IconButton onClick={onClick} disabled={disabled} >
    <FontAwesomeIcon icon={faSync} />
  </IconButton>)
}