import { addToClientAction } from "@mahjong/shared/metadataKeys";
import createDecorator from "./createDecorator";

const Client = createDecorator(addToClientAction);
export default Client;
