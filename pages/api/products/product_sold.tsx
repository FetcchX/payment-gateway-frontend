// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function get(req: NextApiRequest, res: NextApiResponse<any[] | string | null>) {
	let jwt = await verifyUser(req, res)
	let { user, error } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	const { data: userData, error: userError } = await supabase
		.from('User')
		.select('*')
		.eq('email', user?.email)
	
	if(!user || !userData || userError || userData?.length === 0) {
		console.log(error)
		res.status(400).send('Page was not created ' + JSON.stringify(error))
		return
	}

	if(req.method === 'GET') {			
		const { data, error } = await supabase.rpc('total_products_sold', {
			user_id: userData[0].id
		})
		
		if(error) {
			console.log(error)
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		console.log(data)
		res.status(201).send(data)
	}
}

export default get