import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from "../../../supabase";
import jwt from 'jsonwebtoken'

const verifyUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const JWT_SECRET = '1733729e-3910-4637-88c1-6fad57d04f26'
		const access_token = req.headers['bearer-token'] as string
		var decoded = jwt.verify(access_token, JWT_SECRET);
	
		return decoded.sub
	} catch (e) {
		res.status(401).send({
			error: JSON.stringify(e)
		})
	}
}

export default verifyUser