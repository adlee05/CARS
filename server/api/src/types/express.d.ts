import { Database } from "../utils/db"; // Adjust the import based on your actual db path
import { Service } from "../utils/inference"; // Adjust the import based on your actual service path

declare global {
  namespace Express {
    interface Request {
      db: Database;
      service: InferenceService;
    }
  }
}
