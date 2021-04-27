import { addToServerAction } from "@mahjong/shared/metadataKeys";
import createDecorator from "./createDecorator";

const Server = createDecorator(addToServerAction);
export default Server;
