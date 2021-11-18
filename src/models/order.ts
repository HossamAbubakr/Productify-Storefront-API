import Client from "../database";

export type Order = {
	id?: number;
	status: string;
	items?: [] | [null];
	user_id: string;
};

export class OrderStore {
	async index(): Promise<Order[]> {
		try {
			const conn = await Client.connect();
			const sql = `SELECT orders.*,
			array_agg(row_to_json(order_products)) AS items
			FROM orders
			FULL JOIN order_products ON orders.id = order_products.order_id
			GROUP BY orders.id`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (error) {
			throw new Error(`Could not get orders, ${error}`);
		}
	}

	async show(id: number): Promise<Order> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM orders WHERE id=($1)";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not get order ${id}, ${error}`);
		}
	}

	async create(o: Order): Promise<Order> {
		try {
			const conn = await Client.connect();
			const sql = "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";
			const result = await conn.query(sql, [o.status, o.user_id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not create order ${o}, ${error}`);
		}
	}

	async update(order: Order): Promise<Order> {
		try {
			const conn = await Client.connect();
			const sql = "UPDATE orders SET status=($2) WHERE id=($1) RETURNING *";
			const result = await conn.query(sql, [order.id, order.status]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not update product ${order.id}, ${error}`);
		}
	}

	async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
		try {
			const conn = await Client.connect();
			const sql = "INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";
			const result = await conn.query(sql, [quantity, orderId, productId]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not add product ${productId} to order ${orderId}: ${error}`);
		}
	}

	async delete(id: number): Promise<Order> {
		try {
			const conn = await Client.connect();
			const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (error) {
			throw new Error(`Could not delete order ${id}, ${error}`);
		}
	}
}
