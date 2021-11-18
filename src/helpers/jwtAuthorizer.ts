import { Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export default function Authorize(req: Request, user_id: string | null = null) {
	const authorizationHeader = req.headers.authorization;
	const token = authorizationHeader?.split(" ")[1];
	const decoded = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
	if (user_id && decoded.user.id !== user_id) {
		throw new Error("User id does not match!");
	}
}
