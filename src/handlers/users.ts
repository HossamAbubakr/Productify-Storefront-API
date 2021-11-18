import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import { sign } from "jsonwebtoken";
import Authorize from "../helpers/jwtAuthorizer";

const store = new UserStore();

const index = async (req: Request, res: Response) => {
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const user = await store.index();
	res.json(user);
};

const show = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: id");
	}
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const user = await store.show(id);
	if (user === undefined) {
		res.status(404);
		return res.json("User not found");
	}
	res.json(user);
};

const create = async (req: Request, res: Response) => {
	const { firstname, lastname, password } = req.body;
	if (firstname === undefined || lastname === undefined || password === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: firstname, lastname, password");
	}
	const user: User = { firstname, lastname, password };
	try {
		const newUser = await store.create(user);
		var token = sign({ user: { id: newUser.id, firstname, lastname } }, process.env.TOKEN_SECRET as string);
		res.json(token);
	} catch (err) {
		res.status(400);
		res.json(String(err) + user);
	}
};

const update = async (req: Request, res: Response) => {
	const { id, firstname, lastname, password } = req.body;
	if (id === undefined || firstname === undefined || lastname === undefined || password === undefined) {
		res.status(400);
		return res.send(
			"Missing/Invalid parameters, the following parameter are required: id, firstname, lastname, password"
		);
	}
	try {
		Authorize(req, id);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const user: User = { id, firstname, lastname, password };
	try {
		const updated = await store.update(user);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${user}`);
	}
};

const authenticate = async (req: Request, res: Response) => {
	const { firstname, lastname, password } = req.body;
	if (firstname === undefined || lastname === undefined || password === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: firstname, lastname, password");
	}
	const user: User = { firstname, lastname, password };
	try {
		const u = await store.authenticate(user.firstname, user.lastname, user.password);
		if (u === null) {
			res.status(401);
			res.json("Incorrect user information");
		} else {
			var token = sign({ user: { id: u.id, firstname, lastname } }, process.env.TOKEN_SECRET as string);
			res.json(token);
		}
	} catch (error) {
		res.status(401);
		res.json({ error });
	}
};

const destroy = async (req: Request, res: Response) => {
	const id = req.body.id;
	if (id === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: id");
	}
	try {
		Authorize(req, id);
	} catch (err) {
		res.status(401);
		return res.json("Access denied, invalid token");
	}
	try {
		const deletedUser = await store.delete(id);
		if (deletedUser === undefined) {
			res.status(404);
			return res.json("User doesn't exist");
		} else {
			res.json("ok");
		}
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const users_routes = (app: express.Application) => {
	app.get("/users", index);
	app.get("/users/:id", show);
	app.put("/users", update);
	app.post("/users", create);
	app.delete("/users", destroy);
	app.post("/users/login", authenticate);
};

export default users_routes;
