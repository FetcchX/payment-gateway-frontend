import { supabase } from "../../../supabase"

const connect_product_to_pages = async (product_ids: number[], pages: number) => {
	for(let i=0;i<product_ids.length;i++) {
		const { data, error } = await supabase.from('product_page').insert([{ product_id: product_ids[i], page_id: pages }])
	}
	return true
}

export default connect_product_to_pages