// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'
import { useRouter } from 'next/router'

interface Page {
	title: string
	logo: string
	description: string
	social_links: Object
	accepted_currencies: string[]
	terms_conditions: string[]
	slug: string
	eth_address?: string
	sol_address?: string
	user: number
	products: Product[]
}

async function create(req: NextApiRequest, res: NextApiResponse<any | string>) {	
	if(req.method === 'GET') {
		const slug = req.query['id']
		let { data, error } = await supabase
			.from('pages')
			.select('*')
			.eq('id', slug)
		console.log(data)
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		let { data: productData, error: productError } = await supabase
			.from('product_page')
			.select('product_id!inner(*)')
			.eq('page_id', data[0].id)
			
		if(!productData || error || productData?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(productError))
			return
		}

		productData = productData?.map(product => product.product_id)

		data[0].products = productData

		res.status(201).send(data[0])
	}
}

export default create