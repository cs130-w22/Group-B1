import { Application } from "express";

/**
 * Controllers that will be registered to the application must implement this interface.
 */
export interface RegistrableController {
  register(app: Application): void;
}
