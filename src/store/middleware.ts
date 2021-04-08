import { dispatchAction } from '@mahjong/server';
import { Middleware } from 'redux';

export const clientSyncMiddleware: Middleware = ({ dispatch, getState }) => {
  return (next) => (event) => {
    next(event);

    //dispatch action给客户端
    dispatchAction({ event, recipients: [0] });
  };
};
