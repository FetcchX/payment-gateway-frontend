import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import jwt from 'jsonwebtoken'
import verifyUser from './middlewares/verifyUser'

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const user = await verifyUser(req, res)
	console.log(user)
	res.status(200).send('dsa')
}

export default handler