import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import Authorize from "../helpers/jwtAuthorizer";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
	const products = await store.index();
	res.json(products);
};

const show = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: id");
	}
	const product = await store.show(id);
	if (product === undefined) {
		res.status(404);
		return res.json("Product not found");
	}
	res.json(product);
};

const create = async (req: Request, res: Response) => {
	const { name, price, category } = req.body;
	if (name === undefined || price === undefined || category === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: name, price, category");
	}
	const product: Product = { name, price, category };
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json("Access denied, invalid token");
	}
	try {
		const newProduct = await store.create(product);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const update = async (req: Request, res: Response) => {
	const { id, name, price, category } = req.body;
	if (id === undefined || name === undefined || price === undefined || category === undefined) {
		res.status(400);
		return res.send("Missing/Invalid parameters, the following parameter are required: id, name, price, category");
	}
	try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const product: Product = { id, name, price, category };
	try {
		const updated = await store.update(product);
		res.json(updated);
	} catch (err) {
		res.status(400);
		res.json(`${err} ${product}`);
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
		const deletedProduct = await store.delete(id);
		if (deletedProduct === undefined) {
			res.status(404);
			return res.json("Product doesn't exist");
		} else {
			res.json("ok");
		}
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const products_routes = (app: express.Application) => {
	app.get("/products", index);
	app.get("/products/:id", show);
	app.put("/products", update);
	app.post("/products", create);
	app.delete("/products", destroy);
};

export default products_routes;
