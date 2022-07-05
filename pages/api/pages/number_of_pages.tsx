// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function create(req: NextApiRequest, res: NextApiResponse<any | string>) {
	let jwt = await verifyUser(req, res)
	let { user, error: userError } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	
	if(req.method === 'GET') {
		var { data, error, count } = await supabase
			.from('pages')
			.select('*,user!inner(*)', { count: 'exact', head: true })
			.eq('user.email', user?.email)
		console.log(data, "das")	
		if(error) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(count)
	}
}

export default create