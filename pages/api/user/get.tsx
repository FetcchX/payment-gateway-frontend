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
	if(req.method === 'GET') {
		const email = req.query['email']
		
		const { data, error } = await supabase
			.from('User')
			.select('*')
			.eq('email', email)
		
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		
		res.status(201).send(data[0] as User)
	}
}

export default create