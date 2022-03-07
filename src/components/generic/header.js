import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export const Header = ({ buttonImage, onButtonClick, children }) => <AppBar position="sticky"><Toolbar>
  <IconButton
    size="large"
    edge="start"
    color="inherit"
    aria-label="menu"
    sx={{ mr: 2 }}
    disabled={!buttonImage || !onButtonClick}
    onClick={onButtonClick}
  >{buttonImage && <FontAwesomeIcon icon={buttonImage} />}
  </IconButton>
  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    {children}
  </Typography></Toolbar>
</AppBar>