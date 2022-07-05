// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function create(req: NextApiRequest, res: NextApiResponse<any>) {
	
	if(req.method === 'POST') {
		const submissionData = JSON.parse(req.body)
		console.log(submissionData)
		const { data: sub_data, error } = await supabase.from('submission')
			.update({
				transaction_hash: submissionData.transaction_hash,
			})
			.match({
				id: submissionData.id
			})
		console.log(sub_data)

		if(!sub_data || error || sub_data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		if(submissionData.transaction_hash) {
			sub_data[0].products.map((value: any) => {
				fetch('/api/products/increment_sold', {
					method: 'POST',
					body: JSON.stringify({
						product_id: value
					})
				})
			})
		}

		res.status(201).send(submissionData)
	}
}

export default create