import { Database } from '../db'; // Adjust the import based on your actual db path
import { Service } from '../service'; // Adjust the import based on your actual service path

declare global {
  namespace Express {
    interface Request {
      db: Database; // Assuming db is an instance of your Database class
      service: Service; // Assuming service is an instance of your Service class
    }
  }
}
