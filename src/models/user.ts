import Client from "../database";
import bcrypt from "bcrypt";

export type User = {
	id?: number;
	firstname: string;
	lastname: string;
	password: string;
};

const pepper = process.env.BCRYPT_PASSWORD;
const salt_rounds = process.env.SALT_ROUNDS;

export class UserStore {
	async index(): Promise<User[]> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM users";
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`Could not get users, ${error}`);
		}
	}

	async show(id: number): Promise<User> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM users WHERE id=($1)";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not get user ${id}, ${error}`);
		}
	}

	async create(u: User): Promise<User> {
		try {
			const conn = await Client.connect();
			const sql = "INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *";
			const hash = bcrypt.hashSync(u.password + pepper, parseInt(String(salt_rounds)));
			const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
			const user = result.rows[0];
			conn.release();
			return user;
		} catch (err) {
			throw new Error(`unable create user (${(u.firstname, u.lastname)}): ${err}`);
		}
	}

	async update(user: User): Promise<User> {
		try {
			const conn = await Client.connect();
			const sql = "UPDATE users SET firstname=($2), lastname=($3), password_digest=($4) WHERE id=($1) RETURNING *";
			const hash = bcrypt.hashSync(user.password + pepper, parseInt(String(salt_rounds)));
			const result = await conn.query(sql, [user.id, user.firstname, user.lastname, hash]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not update user ${user.id}, ${error}`);
		}
	}

	async delete(id: number): Promise<User> {
		try {
			const conn = await Client.connect();
			const sql = "DELETE FROM users WHERE id=($1) RETURNING *";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not delete user ${id}, ${error}`);
		}
	}

	async authenticate(firstname: string, lastname: string, password: string): Promise<User | null> {
		const conn = await Client.connect();
		const sql = "SELECT * FROM users WHERE firstname=($1) AND lastname=($2)";
		const result = await conn.query(sql, [firstname, lastname]);
		if (result.rows.length) {
			const user = result.rows[0];
			if (bcrypt.compareSync(password + pepper, user.password_digest)) {
				return user;
			}
		}
		return null;
	}
}
