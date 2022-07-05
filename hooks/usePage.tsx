import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { Page, Pages } from "../types/Pages"

const usePages = () => {
	const [pages, setPages] = useState<Pages>({ cursor: 0, data: [] } as Pages)

	async function getPages(cursor?: number) {
		if(!cursor) {
			const data = await fetch('${process.env.NEXT_BACKEND_URL}/api/pages/', {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			setPages(res)
		} else {
			const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/pages?cursor=${cursor.toString()}`, {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			setPages(res)
		}
	}

	async function createPage(page: Page) {
		var data = await fetch('${process.env.NEXT_BACKEND_URL}/api/pages/', {
			method: 'POST',
			body: JSON.stringify(page),
			headers: {
			'bearer-token': supabase.auth.session()?.access_token as string,
			'Content-Type': 'application/json'
			},
		})

		const res = await data.json()

		getPages()

		return res
	}

	useEffect(() => getPages() as any, [])

	return [pages, getPages, createPage] as any
}

export default usePages