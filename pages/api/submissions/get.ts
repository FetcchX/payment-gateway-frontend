// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function create(req: NextApiRequest, res: NextApiResponse<any | string>) {
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

	console.log(userData[0].id, "userId")

	if(req.method === 'GET') {
		const { data: pageData, error: pageError } = await supabase.from('pages').select('id').eq('user', userData[0].id)
		
		console.log(pageData, userData[0].id)

		if(!pageData || pageError || pageData?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(pageError))
			return
		}

		console.log(pageData)

		const { data, error } = await supabase
			.from('submission')
			// .select('product_id!inner(*),submission_id!inner(*),page_id!inner(*)')
			.select(`
				*
			`)
			.in('page_id', pageData.map(page => page.id))
		
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(data)
	}
}

export default create