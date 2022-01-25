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

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(RoommateController);
container.bind<RoommateService>(TYPES.RoommateService).to(RoommateService);
container
  .bind<RoommateRepository>(TYPES.RoommateRepository)
  .to(RoommateRepositoryImplMongo);

export default container;
