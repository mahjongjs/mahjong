import 'tsconfig-paths/register';

import { spawnSession } from '@mahjong/store';
import Koa from 'koa';

const server = new Koa();
server.listen(3555);
export const dispatchAction = (action) => {
  console.log(action);
};

const { actions, store } = spawnSession();

store.dispatch(actions.takeFront(0));

// console.log(store);
// store.dispatch({})
