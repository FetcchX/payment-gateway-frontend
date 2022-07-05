// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import formidable from 'formidable'
import { uploadFile } from './create';

export const config = {
	api: {
	  bodyParser: false,
	},
  };
  

async function create(req: NextApiRequest, res: NextApiResponse<any | string>) {
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
		const file = req.query['file']

		const promise = new Promise((resolve, reject) => {

			console.log('form')
			const form = new formidable.IncomingForm({ multiples: true });
			// console.log(form)
			form.on('file', function(name, file) { console.log(name, file) });
			form.on('error', function(err) { console.log(err) });
			form.on('aborted', function() { });
			form.parse(req, (err, fields, files) => {
				const reader = new FileReader()
				reader.onload = function() {
					const blob = new Blob([new Uint8Array(files.logo as any)], {type: 'png' });
					console.log(blob)
				}

				// @ts-ignore
				uploadFile(files.logo as File, file as string)

				resolve({fields, files});
			})
		
		})
		
		return promise.then(({fields, files}: any) => {
			res.status(200).json({ fields, files })
		})
	}
}

export default create