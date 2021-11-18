import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV } = process.env;

const clientConfig = {
	host: POSTGRES_HOST,
	database: ENV === "dev" ? POSTGRES_DB : POSTGRES_TEST_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
};

console.log("The database will be using the following configuration settings", clientConfig);

const Client = new Pool(clientConfig);

export default Client;
