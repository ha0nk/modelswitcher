import { Grid, Typography, Box, Card, CardContent, CardActionArea } from "@mui/material";
import { Fragment } from "react";
import { Tip } from "../generic/tip";
import { useRecoilValue } from "recoil";
import { _twitchConnected, _twitchRewards } from "../../atoms";
import { useNavigate } from 'react-router-dom';
import { Header } from "../generic/header";
import tinyColor from 'tinycolor2';

export const Rewards = () => {
  const twitchRewards = useRecoilValue(_twitchRewards);
  const twitchAuth = useRecoilValue(_twitchConnected);

  const navigate = useNavigate();
  const renderCurrentRewardCards = () => <Fragment>{twitchRewards && twitchRewards.map(renderRewardCard)}</Fragment>
  const renderCreateRewardCard = () => <GridCard onCardClick={() => navigate(`/reward`)}>
    <Typography>Add Reward</Typography></GridCard>
  const renderRewardCard = (r, i) => <GridCard backgroundColor={r.backgroundColor} key={i} onCardClick={() => navigate(`/reward/${r.id}`)}>
    <Typography>{r.title}</Typography>
  </GridCard>

  const GridCard = ({ children, backgroundColor = "#FFFFFF", onCardClick, ...gridProps }) => <Grid item xs={2} sm={4} md={4} {...gridProps}>
    <Card sx={{backgroundColor, color: tinyColor.mostReadable(backgroundColor, ["#FFFFFF", !twitchAuth.error ? "#000000" : "#979797"]).toRgbString()}} ><CardActionArea disabled={twitchAuth.error} onClick={onCardClick}>
      <CardContent>
        {children}
      </CardContent>
    </CardActionArea>
    </Card>
  </Grid>

  return (<Fragment>
    <Header>Create and Edit Twitch Rewards <Tip text="Rewards must be created through Modelswitcher to be seen and used here." /></Header>
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="stretch">
        {renderCurrentRewardCards()}
        {renderCreateRewardCard()}
      </Grid>
    </Box>
  </Fragment>)
}