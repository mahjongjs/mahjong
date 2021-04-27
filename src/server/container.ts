import { Container } from "inversify";
import { IStoreService, StoreService } from "./StoreService";
import { ISessionService, SessionService } from "./SessionService";
import { ILoggingService, LoggerService } from "./LoggingService";
import tokens from "./tokens";

const container = new Container();
container
  .bind<ISessionService>(tokens.SessionService)
  .to(SessionService)
  .inSingletonScope();
container
  .bind<IStoreService>(tokens.StoreService)
  .to(StoreService)
  .inSingletonScope();
container.bind<ILoggingService>(tokens.LoggingService).to(LoggerService);
export default container;
