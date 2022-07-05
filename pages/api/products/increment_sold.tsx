// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function get(req: NextApiRequest, res: NextApiResponse<Product[] | string>) {
	if(req.method === 'POST') {			
		const body = JSON.parse(req.body)
		const { data, error } = await supabase.rpc('increment_sold', {
			product_id: body.product_id
		})
		
		if(!data || error || data?.length === 0) {
			console.log(error)
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		console.log(data)
		res.status(201).send(data)
	}
}

export default get