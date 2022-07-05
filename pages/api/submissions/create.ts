// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

interface Submission {
	name: string
	contact_number?: string
	email: string
	eth_address?: string
	sol_address?: string
	products: number[]
	page_id: number
	transaction_hash: string
}

async function create(req: NextApiRequest, res: NextApiResponse<Submission | string>) {
	if(req.method === 'POST') {
		const submissionData = JSON.parse(req.body) as Submission
		let { ...submission } = submissionData

		let products = submissionData.products

		if(products.length <= 0) {
			res.status(403).send('Select Products first!')
		}

		const { data: sub_data, error } = await supabase.from('submission').insert([submission])

		if(!sub_data || error || sub_data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		for(let i=0;i<products.length;i++) {
			const { data, error } = await supabase.from('bought').insert([{ product_id: products[i], submission_id:  sub_data[0].id }])
			
			if(!data || error || data?.length === 0) {
				res.status(400).send('Page was not created ' + JSON.stringify(error))
				return
			}
		}

		res.status(201).send(sub_data[0] as Submission)
	}
}

export default create