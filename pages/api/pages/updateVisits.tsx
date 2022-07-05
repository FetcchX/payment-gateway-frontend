// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'

async function create(req: NextApiRequest, res: NextApiResponse<boolean | string>) {
	if(req.method === 'PATCH') {
		let page_id = Number(req.query['id'])
		const { data, error } = await supabase.rpc('increment_visit', {
			page_id: page_id
		})
		
		if(error) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(true)
	}
}

export default create