import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Tooltip } from "@mui/material";

export const Tip = ({ text }) => <Tooltip title={text}>
  <span>
    <IconButton disabled size="small">
      <FontAwesomeIcon icon={faQuestionCircle} />
    </IconButton>
  </span>
</Tooltip>