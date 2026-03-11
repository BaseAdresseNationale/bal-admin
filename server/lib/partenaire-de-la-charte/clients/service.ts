import { AppDataSource } from "../../../utils/typeorm-client";
import { Client } from "./entity";

const clientRepository = AppDataSource.getRepository(Client);

export async function findAll(): Promise<Client[]> {
  return clientRepository.find();
}
