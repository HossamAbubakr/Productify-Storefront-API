import supertest from "supertest";
import app from "../../server";
import { User } from "../../models/user";
import { Product } from "../../models/product";

const request = supertest(app);
describe("Testing Endpoint: /products", () => {
	const product: Product = { name: "Hoverboard", price: 10000, category: "Flying Vehicles" };
	let productId: string;
	let token: string;
	beforeAll(async () => {
		const user: User = { firstname: "ATD", lastname: "Dummy", password: "Password" };
		await request
			.post("/users")
			.send(user)
			.expect(200)
			.then((res) => {
				token = res.body;
			});
	});

	it("Testing the create endpoint with an invalid token", async () => {
		await request.post("/products").send(product).set("Authorization", "Bearer heyIamafaketoken").expect(401);
	});

	it("Testing the create endpoint with a valid token", async () => {
		await request
			.post("/products")
			.send(product)
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				expect(res.body.name).toEqual("Hoverboard");
				productId = res.body.id;
			});
	});

	it("Testing the index endpoint", async () => {
		await request
			.get("/products")
			.expect(200)
			.then((res) => {
				expect(res.text).toContain("Hoverboard");
			});
	});

	it("Testing the read endpoint with invalid product ID", async () => {
		await request.get("/products/999").set("Authorization", `Bearer ${token}`).expect(404);
	});

	it("Testing the read endpoint with valid product ID", async () => {
		await request
			.get(`/products/${productId}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => {
				expect(res.text).toContain("Hoverboard");
			});
	});

	it("Testing the update endpoint with an invalid token", async () => {
		await request
			.put("/products")
			.set("Authorization", "Bearer heyIamafaketoken")
			.send({ id: productId, name: "Mark XLIV: Hulkbuster", price: "15000", category: product.category })
			.expect(401);
	});

	it("Testing the update endpoint with a valid token", async () => {
		await request
			.put("/products")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: productId, name: "Mark XLIV: Hulkbuster", price: "15000", category: product.category })
			.expect(200)
			.then((res) => {
				expect(res.body.name).toEqual("Mark XLIV: Hulkbuster");
			});
	});

	it("Testing the delete endpoint with valid token and invalid Product ID", async () => {
		await request.delete("/products").set("Authorization", "Bearer heyIamafaketoken").send({ id: 999 }).expect(401);
	});
	it("Testing the delete endpoint with valid token and valid Product ID", async () => {
		await request.delete("/products").set("Authorization", `Bearer ${token}`).send({ id: productId }).expect(200);
	});
});
