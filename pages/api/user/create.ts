// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'

interface User {
	username: string
	eth_address: string
	sol_address: string
	email: string
	is_paid?: boolean
}

async function create(req: NextApiRequest, res: NextApiResponse<User | string>) {
	if(req.method === 'POST') {
		req.body = JSON.parse(req.body)
		console.log(req.body)
		let user = req.body as User
		user.is_paid = false
		
		console.log(user)
		const { data, error } = await supabase
			.from('User')
			.insert([user])
		
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		res.status(201).send(user)
	}
}

export default create