// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function create(req: NextApiRequest, res: NextApiResponse<Product | string>) {
	if(req.method === 'GET') {		
		const id = req.query['id']
		
		const { data, error } = await supabase
			.from('product')
			.select('*')
			.eq('id', id)
		
		if(!data || error || data?.length === 0) {
			console.log(error)
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		res.status(201).send(data[0])
	}
}

export default create