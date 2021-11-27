import {
  atom
} from 'recoil';

export const _vtubeStatus = atom({
  key: '_vtubeStatus',
  default: {},
});

export const _twitchConnected = atom({
  key: '_twitchConnected',
  default: false,
});

export const _vtubeModels = atom({
  key: '_vtubeModels',
  default: {},
});

export const _twitchRewards = atom({
  key: '_twitchRewards',
  default: false,
});
