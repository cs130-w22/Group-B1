import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";
import { RoommateService } from "./src/services/RoommateService";
import { RegistrableController } from "./src/controllers/RegistrableController";
import { RoommateController } from "./src/controllers/RoommateController";
import {
  RoommateRepository,
  RoommateRepositoryImplMongo,
} from "./src/repository/RoommateRepository";
import { AuthorizationService } from "./src/services/AuthorizationService";
import { AuthorizationController } from "./src/controllers/AuthorizationController";

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(RoommateController);
container
  .bind<RegistrableController>(TYPES.Controller)
  .to(AuthorizationController);

container.bind<RoommateService>(TYPES.RoommateService).to(RoommateService);
container
  .bind<AuthorizationService>(TYPES.AuthorizationService)
  .to(AuthorizationService);

container
  .bind<RoommateRepository>(TYPES.RoommateRepository)
  .to(RoommateRepositoryImplMongo);

export default container;
