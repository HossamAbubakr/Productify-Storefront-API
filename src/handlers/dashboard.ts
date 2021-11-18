import express, { Request, Response } from "express";
import { DashboardQueries } from "../services/dashboard";
import Authorize from "../helpers/jwtAuthorizer";

const dashboard = new DashboardQueries();

const topFiveProducts = async (req: Request, res: Response) => {
	const products = await dashboard.topFiveProducts();
	res.json(products);
};

const productsByCategory = async (req: Request, res: Response) => {
	const category = req.body.category;
	if (category === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: category");
	}
	const users = await dashboard.productsByCategory(category);
	res.json(users);
};

const completedUserOrders = async (req: Request, res: Response) => {
	const user_id = req.body.user_id;
	if (user_id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: user_id");
	}
	try {
		Authorize(req, user_id);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const products = await dashboard.completedUserOrders(user_id);
	res.json(products);
};

const currentUserOrders = async (req: Request, res: Response) => {
	const user_id = req.body.user_id;
	if (user_id === undefined) {
		res.status(400);
		return res.send("Missing or invalid parameters, this endpoint requires the following parameter: user_id");
	}
	try {
		Authorize(req, user_id);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}
	const products = await dashboard.currentUserOrders(user_id);
	res.json(products);
};

const dashboard_routes = (app: express.Application) => {
	app.get("/products/top_five", topFiveProducts);
	app.post("/products/by_category", productsByCategory);
	app.post("/orders/completed", completedUserOrders);
	app.post("/orders/current", currentUserOrders);
};

export default dashboard_routes;
