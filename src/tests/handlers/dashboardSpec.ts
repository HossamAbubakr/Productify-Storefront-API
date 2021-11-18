import supertest from "supertest";
import app from "../../server";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { JwtPayload, verify } from "jsonwebtoken";

const request = supertest(app);

describe("Testing Endpoint: dashboard", () => {
	const order: Order = { user_id: "", status: "active" };
	type purchaseOrder = { product_id: string; quantity: number };
	let productIds: string[] = [];
	let orderIds: string[] = [];
	let userId: string;
	let token: string;

	beforeAll(async () => {
		await request
			.post("/users")
			.send({ firstname: "ATD", lastname: "Dummy", password: "Password" })
			.expect(200)
			.then((res) => {
				token = res.body;
				const decodedJWT = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
				userId = decodedJWT.user.id as string;
				order.user_id = userId as unknown as string;
			});

		const products: Product[] = [
			{ name: "Hoverboard", price: 10000, category: "Flying Vehicles" },
			{ name: "Mark XLIV: Hulkbuster", price: 15000, category: "Flying Vehicles" },
			{ name: "The DeLorean", price: 3000, category: "Special Vehicles" },
			{ name: "Orion Pax", price: 400000, category: "Special Vehicles" },
			{ name: "KITT", price: 10000, category: "Armored Vehicles" },
			{ name: "The War Rig", price: 8000, category: "Armored Vehicles" },
		];

		const orders: Order[] = [
			{ user_id: userId, status: "active" },
			{ user_id: userId, status: "completed" },
			{ user_id: userId, status: "active" },
		];

		for (const product of products) {
			await request
				.post("/products")
				.set("Authorization", `Bearer ${token}`)
				.send(product)
				.then((res) => {
					productIds.push(res.body.id);
				});
		}

		for (const order of orders) {
			await request
				.post("/orders")
				.set("Authorization", `Bearer ${token}`)
				.send(order)
				.then((res) => {
					orderIds.push(res.body.id);
				});
		}

		const purchaseOrders: purchaseOrder[] = [
			{ product_id: productIds[0], quantity: 50 },
			{ product_id: productIds[1], quantity: 25 },
			{ product_id: productIds[1], quantity: 29 },
			{ product_id: productIds[2], quantity: 29 },
			{ product_id: productIds[2], quantity: 14 },
			{ product_id: productIds[2], quantity: 3 },
			{ product_id: productIds[3], quantity: 80 },
			{ product_id: productIds[3], quantity: 100 },
			{ product_id: productIds[4], quantity: 12 },
			{ product_id: productIds[5], quantity: 43 },
		];
		for (const purOrder of purchaseOrders) {
			await request
				.post(`/orders/${orderIds[0]}/products`)
				.set("Authorization", `Bearer ${token}`)
				.send(purOrder)
				.expect(200);
		}
	});

	it("Testing the get products by category endpoint with invalid request", async () => {
		await request
			.post("/products/by_category")
			.set("Authorization", `Bearer ${token}`)
			.send({ not_category: "Flying Vehicles" })
			.expect(400);
	});

	it("Testing the get products by category endpoint with valid request", async () => {
		await request
			.post("/products/by_category")
			.set("Authorization", `Bearer ${token}`)
			.send({ category: "Flying Vehicles" })
			.expect(200)
			.then((res) => {
				expect(res.body.length).toBeGreaterThanOrEqual(2);
			});
	});

	it("Testing the get user completed orders endpoint with invalid User ID", async () => {
		await request.post("/orders/completed").set("Authorization", `Bearer ${token}`).send({ user_id: 999 }).expect(401);
	});

	it("Testing the get user completed orders endpoint with valid User ID", async () => {
		await request
			.post("/orders/completed")
			.set("Authorization", `Bearer ${token}`)
			.send({ user_id: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.length).toBeGreaterThanOrEqual(1);
			});
	});

	it("Testing the get user current orders endpoint with invalid User ID", async () => {
		await request.post("/orders/current").set("Authorization", `Bearer ${token}`).send({ user_id: 999 }).expect(401);
	});

	it("Testing the get user current orders endpoint with valid User ID", async () => {
		await request
			.post("/orders/current")
			.set("Authorization", `Bearer ${token}`)
			.send({ user_id: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.length).toBeGreaterThanOrEqual(2);
			});
	});

	it("Testing the top five products", async () => {
		const lowSalesProduct = { name: "KITT", price: 10000, units_sold: 12 };
		await request
			.get("/products/top_five")
			.expect(200)
			.then((res) => {
				expect(res.body).not.toContain(lowSalesProduct);
			});
	});
});
