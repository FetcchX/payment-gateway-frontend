// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'

interface User {
	username: string
	is_available: boolean
}

async function create(req: NextApiRequest, res: NextApiResponse<User | string>) {
	if(req.method === 'GET') {
		const username = req.query['username']
		
		const { data, error } = await supabase
			.from('User')
			.select('username')
			.eq('username', username)
		
		if(error || data?.length === 0) {
			const returnData: User = {
				username: username as string,
				is_available: true
			} 
			res.status(200).send(returnData)
			return
		}
		
		const returnData: User = {
			username: username as string,
			is_available: false
		} 
		
		res.status(400).send(returnData)
	}
}

export default create