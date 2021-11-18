import supertest from "supertest";
import app from "../../server";
import { Order } from "../../models/order";
import { JwtPayload, verify } from "jsonwebtoken";

const request = supertest(app);
describe("Testing Endpoint: /orders", () => {
	const order: Order = { user_id: "", status: "active" };
	let productId: string;
	let userId: number;
	let orderId: string;
	let token: string;
	beforeAll(async () => {
		await request
			.post("/users")
			.send({ firstname: "ATD", lastname: "Dummy", password: "Password" })
			.expect(200)
			.then((res) => {
				token = res.body;
				const decodedJWT = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
				userId = decodedJWT.user.id;
				order.user_id = userId as unknown as string;
			});
		await request
			.post("/products")
			.send({ name: "ED 209", price: "100000", category: "Experimental Vehicles" })
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				productId = res.body.id;
			});
	});

	it("Testing the create endpoint with an invalid token", async () => {
		await request.post("/orders").send(order).set("Authorization", "Bearer heyIamafaketoken").expect(401);
	});

	it("Testing the create endpoint with a valid token and mismatched user", async () => {
		await request
			.post("/orders")
			.send({ status: order.status, user_id: 999 })
			.set("Authorization", `Bearer ${token}`)
			.expect(401);
	});

	it("Testing the create endpoint with a valid token and valid user", async () => {
		await request
			.post("/orders")
			.send(order)
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				orderId = res.body.id;
			});
	});

	it("Testing the index endpoint", async () => {
		await request.get("/orders").expect(200);
	});

	it("Testing the read endpoint with invalid Order ID", async () => {
		await request.get("/orders/999").set("Authorization", `Bearer ${token}`).expect(404);
	});

	it("Testing the read endpoint with valid Order ID", async () => {
		await request.get(`/orders/${orderId}`).set("Authorization", `Bearer ${token}`).expect(200);
	});

	it("Testing the add order endpoint with invalid token", async () => {
		await request
			.post(`/orders/${orderId}/products`)
			.set("Authorization", "Bearer heyIamafaketoken")
			.send({ orderId, product_id: productId, quantity: 5 })
			.expect(401);
	});

	it("Testing the add order endpoint with valid token", async () => {
		await request
			.post(`/orders/${orderId}/products`)
			.set("Authorization", `Bearer ${token}`)
			.send({ product_id: productId, quantity: 5 })
			.expect(200);
	});

	it("Testing the update endpoint with an invalid token", async () => {
		await request
			.put("/orders")
			.set("Authorization", "Bearer heyIamafaketoken")
			.send({ id: orderId, status: "completed", user_id: userId })
			.expect(401);
	});

	it("Testing the update endpoint with a valid token", async () => {
		await request
			.put("/orders")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: orderId, status: "completed", user_id: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.status).toEqual("completed");
			});
	});

	it("Testing the delete endpoint with valid token and invalid Order ID", async () => {
		await request.delete("/orders").set("Authorization", "Bearer heyIamafaketoken").send({ id: 999 }).expect(401);
	});

	it("Testing the delete endpoint with valid token and valid Order ID", async () => {
		await request.delete("/orders").set("Authorization", `Bearer ${token}`).send({ id: orderId }).expect(200);
	});
});
