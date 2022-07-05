// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

interface Page {
	title: string
	logo: File
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

export const uploadFile = async (file: File, projectId: any) => {
    const { data, error } = await supabase.storage
		.from('store')
		.upload(`${projectId}`, file, {
			cacheControl: '3600',
			upsert: false,
		})

	const { data: dataE, error: errorE } = await supabase.storage.listBuckets()
	console.log(dataE, "DATAE")

	if (error) console.log(error, 'Errorx')
	console.log(data)
}

async function create(req: NextApiRequest, res: NextApiResponse<Page | string>) {
	let jwt = await verifyUser(req, res)
	let { user, error } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	
	if(!user) {
		res.status(400).send("Wrong User")
		return
	}

	const { data: userData, error: userError } = await supabase
		.from('User')
		.select('*')
		.eq('email', user.email)

	if(!userData || error || userData.length == 0) {
		res.status(400).send("Wrong User")
		return
	}

	if(req.method === 'POST') {
		const pageData = JSON.parse(req.body) as Page
		let { products, logo, ...page } = pageData
		console.log(logo, "LOGO")
		page.user = userData[0].id

		if(!page.eth_address) page.eth_address = userData[0].eth_address
		if(!page.sol_address) page.sol_address = userData[0].sol_address
		
		console.log(page, products)
		const { data, error } = await supabase
			.from('pages')
			.insert([page])
		
		if(!data || error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		let product_ids = await createProducts(products, userData[0].id, data[0].id)
		let connect_product = await connect_product_to_pages(product_ids, data[0].id)

		// uploadFile(logo, data[0].id)

		res.status(201).send(data[0] as Page)
	}
}

export default create