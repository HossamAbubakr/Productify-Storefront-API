import supertest from "supertest";
import app from "../../server";
import { JwtPayload, verify } from "jsonwebtoken";
import { User } from "../../models/user";

const request = supertest(app);
describe("Testing Endpoint: /users", () => {
	const user: User = { firstname: "ATD", lastname: "Dummy", password: "Password" };
	let token: string;
	let userId: string;
	it("Testing the create endpoint", async () => {
		await request
			.post("/users")
			.send(user)
			.expect(200)
			.then((res) => {
				token = res.body;
				const decodedJWT = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
				userId = decodedJWT.user.id;
			});
	});

	it("Testing the index endpoint with valid token", async () => {
		await request.get("/users").set("Authorization", `Bearer ${token}`).expect(200);
	});

	it("Testing the index endpoint with invalid token", async () => {
		await request.get("/users").set("Authorization", "Bearer heyIamafaketoken").expect(401);
	});

	it("Testing the read endpoint with valid token and valid user ID", async () => {
		await request.get(`/users/${userId}`).set("Authorization", `Bearer ${token}`).expect(200);
	});

	it("Testing the read endpoint with valid token and invalid user ID", async () => {
		await request.get("/users/999").set("Authorization", `Bearer ${token}`).expect(404);
	});

	it("Testing the read endpoint with invalid token and invalid user ID", async () => {
		await request.get("/users/999").set("Authorization", "Bearer heyIamafaketoken").expect(401);
	});

	it("Testing the authorization endpoint with valid user", async () => {
		await request.post("/users/login").send(user).expect(200);
	});

	it("Testing the authorization endpoint with invalid user", async () => {
		await request
			.post("/users/login")
			.send({ firstname: "DTA", lastname: "ymmuD", password: "drowssaP" })
			.expect(401)
			.then((res) => {
				expect(res.text).toContain("Incorrect user information");
			});
	});

	it("Testing the update endpoint with different user ID", async () => {
		await request
			.put("/users")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: 999, firstname: user.firstname, lastname: user.lastname, password: user.password })
			.expect(401);
	});

	it("Testing the update endpoint with current user ID", async () => {
		await request
			.put("/users")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: userId, firstname: "updated ATD", lastname: user.lastname, password: user.password })
			.expect(200)
			.then((res) => {
				expect(res.text).toContain("updated ATD");
			});
	});

	it("Testing the delete endpoint with valid token and invalid user ID", async () => {
		await request.delete("/users").set("Authorization", "Bearer heyIamafaketoken").send({ id: 999 }).expect(401);
	});
	it("Testing the delete endpoint with valid token and valid user ID", async () => {
		await request.delete("/users").set("Authorization", `Bearer ${token}`).send({ id: userId }).expect(200);
	});
});
