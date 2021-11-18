import Client from "../database";

export type Product = {
	id?: number;
	name: string;
	price: number;
	category: string;
};

export class ProductStore {
	async index(): Promise<Product[]> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM products";
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`Could not get product, ${error}`);
		}
	}

	async show(id: number): Promise<Product> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM products WHERE id=($1)";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not get product ${id}, ${error}`);
		}
	}

	async create(p: Product): Promise<Product> {
		try {
			const conn = await Client.connect();
			const sql = "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
			const result = await conn.query(sql, [p.name, p.price, p.category]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not create product ${p}, ${error}`);
		}
	}

	async update(product: Product): Promise<Product> {
		try {
			const conn = await Client.connect();
			const sql = "UPDATE products SET name=($2), price=($3), category=($4) WHERE id=($1) RETURNING *";
			const result = await conn.query(sql, [product.id, product.name, product.price, product.category]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not update product ${product.id}, ${error}`);
		}
	}

	async delete(id: number): Promise<Product> {
		try {
			const conn = await Client.connect();
			const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not delete product ${id}, ${error}`);
		}
	}
}
