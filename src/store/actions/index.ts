import { BaseAction } from "./BaseAction";

const protoToInstanceMap = new WeakMap<
  { new (): BaseAction<any> },
  BaseAction<any>
>();
const getAction = <T extends BaseAction<any>>(proto: { new (): T }) => {
  let inst = protoToInstanceMap.get(proto);

  if (!inst) {
    inst = new proto();
    protoToInstanceMap.set(proto, inst);
  } else {
  }
  return inst;
};

export default getAction;

export * from "./TakeAction";
export * from "./EatAction";
export * from "./PlayAction";
export * from "./TakeFrontAction";
export * from "./TakeRearAction";
export * from "./ChangePlayerAction";
