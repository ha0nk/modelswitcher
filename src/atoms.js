import {
  atom, atomFamily
} from 'recoil';

export const _profiles = atom({
  key: '_profiles',
  default: []
})
export const _vtubeStatus = atom({
  key: '_vtubeStatus',
  default: {},
});

export const _twitchConnected = atom({
  key: '_twitchConnected',
  default: {error: "disconnected"},
});

export const _vtubeModels = atom({
  key: '_vtubeModels',
  default: null,
});

export const _twitchRewards = atom({
  key: '_twitchRewards',
  default: null,
});

export const _vtubeHotkeys = atomFamily({
  key: '_vtubeHotkeys',
  default: null
})
