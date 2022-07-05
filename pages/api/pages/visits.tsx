// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

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
	let jwt = await verifyUser(req, res)
	let { user, error: userErrors } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	const { data: userData, error: userError } = await supabase
		.from('User')
		.select('*')
		.eq('email', user?.email)
	
	if(!user || !userData || userError || userData?.length === 0) {
		console.log(userError)
		res.status(400).send('Page was not created ' + JSON.stringify(userError))
		return
	}

	if(req.method === 'GET') {
		const { data, error } = await supabase.rpc('get_total_visits', {
			user_id: userData[0].id
		})
		
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(data)
	}
}

export default create