import { dispatchAction } from '@mahjong/server';
import { Middleware } from 'redux';

export const clientSyncMiddleware: Middleware = ({ dispatch, getState }) => {
  return (next) => (action) => {
    next(action);

    //dispatch action给客户端
    dispatchAction(action);
  };
};
