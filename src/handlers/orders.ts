import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/order";
import Authorize from "../helpers/jwtAuthorizer";

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
	const orders = await store.index();
	res.json(orders);
};

const show = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: id");
	}
	const order = await store.show(id);
	if (order === undefined) {
		res.status(404);
		return res.json("Order not found");
	}
	res.json(order);
};

const create = async (req: Request, res: Response) => {
	const { user_id, status } = req.body;
	if (user_id === undefined || status === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: user_id, status");
	}
	const order: Order = { user_id, status };
	try {
		Authorize(req, user_id);
	} catch (err) {
		res.status(401);
		res.json("Access denied, invalid token");
		return;
	}
	try {
		const newOrder = await store.create(order);
		res.json(newOrder);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const update = async (req: Request, res: Response) => {
	const { id, status, user_id } = req.body;
	if (id === undefined || status === undefined || user_id === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: id, status, user_id");
	}
	try {
		Authorize(req, user_id);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const order: Order = { id, status, user_id };
	try {
		const updated = await store.update(order);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${order}`);
	}
};

const addProduct = async (req: Request, res: Response) => {
	const orderId = req.params.id;
	const productId = req.body.product_id;
	const quantity = parseInt(req.body.quantity);
	if (orderId === undefined || productId === undefined || quantity === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: orderId, productId, quantity");
	}
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		res.json("Access denied, invalid token");
		return;
	}
	try {
		const addProduct = await store.addProduct(quantity, orderId, productId);
		res.json(addProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const destroy = async (req: Request, res: Response) => {
	const id = req.body.id;
	if (id === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: id");
	}
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json("Access denied, invalid token");
	}
	try {
		const deletedOrder = await store.delete(id);
		if (deletedOrder === undefined) {
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

const orders_routes = (app: express.Application) => {
	app.get("/orders", index);
	app.get("/orders/:id", show);
	app.put("/orders", update);
	app.post("/orders", create);
	app.delete("/orders", destroy);
	app.post("/orders/:id/products", addProduct);
};

export default orders_routes;
