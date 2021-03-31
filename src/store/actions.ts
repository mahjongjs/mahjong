import { PlayerIndex } from '@mahjong/interfaces/PlayerState';
import { createAction } from '@reduxjs/toolkit';

const takeFront = createAction<PlayerIndex>('takeFront');
