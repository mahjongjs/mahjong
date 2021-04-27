import {
  addToClientAction,
  addToServerAction,
} from '@mahjong/shared/metadataKeys';
import createDecorator from './createDecorator';

const Common = createDecorator(addToClientAction, addToServerAction);
export default Common;
