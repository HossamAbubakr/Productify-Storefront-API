import express, { Request, Response } from "express";
import dashboard_routes from "./handlers/dashboard";
import orders_routes from "./handlers/orders";
import products_routes from "./handlers/products";
import users_routes from "./handlers/users";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

// Body parser is deprecated and its functionality is now built-in;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req: Request, res: Response) {
	res.send("Welcome to Productify the storefront API!");
});

dashboard_routes(app);
orders_routes(app);
products_routes(app);
users_routes(app);

app.listen(3000, function () {
	console.log(`starting app on: ${address}`);
});

export default app;
