import isServer from '@mahjong/shared/isServer';
import {
  addToClientAction,
  addToServerAction,
} from '@mahjong/shared/metadataKeys';
import { PayloadAction } from '@reduxjs/toolkit';
import { ServerStoreData } from '../initializeStoreData';

export class BaseAction<V> {
  protected state: ServerStoreData;
  protected action: PayloadAction<V>;
  protected context: any;
  constructor() {
    this.execute = this.execute.bind(this);
  }

  static createAction(payload: V) {
    return;
  }

  private validate() {}

  public execute(state: ServerStoreData, action: PayloadAction<V>) {
    this.state = state;
    this.action = action;
    try {
      let methods: string[];

      // retrieve method names
      if (isServer()) {
        methods =
          Reflect.getMetadata(addToServerAction, Object.getPrototypeOf(this)) ||
          [];
      } else {
        methods =
          Reflect.getMetadata(addToClientAction, Object.getPrototypeOf(this)) ||
          [];
      }

      methods.map((methodName) => {
        this[methodName].call(this);
      });
    } catch (e) {
      console.log('bailed');
    } finally {
      this.state = null;
      this.action = null;
    }
  }
}
