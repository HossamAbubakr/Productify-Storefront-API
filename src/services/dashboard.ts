import Client from "../database";

export class DashboardQueries {
	async topFiveProducts(): Promise<{ name: string; price: number }[]> {
		try {
			const conn = await Client.connect();
			const sql = `SELECT name, price, sum(order_products.quantity) as units_sold FROM products
			INNER JOIN order_products ON products.id = order_products.product_id
			GROUP BY products.id ORDER BY units_sold DESC LIMIT 5`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Couldn't get current user orders due to ${err}`);
		}
	}

	async productsByCategory(category: string): Promise<{ name: string; price: string }[]> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT name, price FROM products WHERE category=($1)";
			const result = await conn.query(sql, [category]);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Couldn't get products by category due to ${err}`);
		}
	}

	async completedUserOrders(userId: string): Promise<{ name: string; price: number }[]> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM orders WHERE user_id=($1) AND status=($2)";
			const result = await conn.query(sql, [userId, "completed"]);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Couldn't get completed user orders due to ${err}`);
		}
	}

	async currentUserOrders(userId: string): Promise<{ name: string; price: number }[]> {
		try {
			const conn = await Client.connect();
			const sql = "SELECT * FROM orders WHERE user_id=($1) AND status=($2)";
			const result = await conn.query(sql, [userId, "active"]);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Couldn't get current user orders due to ${err}`);
		}
	}
}
