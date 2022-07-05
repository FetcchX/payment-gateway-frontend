// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'

interface User {
	username?: string
	eth_address?: string
	sol_address?: string
	is_paid?: boolean
	email: string
}

async function update(req: NextApiRequest, res: NextApiResponse<User | string>) {
	let jwt = await verifyUser(req, res)
	let { user, error } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	
	if(req.method === 'PATCH') {
		const userBody = JSON.parse(req.body) as User
		console.log(userBody)
		const { data, error } = await supabase
			.from('User')
			.update(userBody)
			.match({ email: user?.email })

		if(!data || error || data?.length === 0) {
			res.status(400).send('User was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(userBody)
	}
}

export default update