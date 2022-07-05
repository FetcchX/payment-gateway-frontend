import { supabase } from "../../../supabase";
import { uploadFile } from "../pages/create";
import { Product } from "../product";

const createProducts = async (products: Product[], userId: number, pageId: number) => {
	let products_data = []
	
	for(let i=0;i<products.length;i++) {
		let { image, ...product } = products[i]

		product.user = userId
		var { data, error } = await supabase.from('product').upsert(product)
		console.log(data, error, "ERROR")
		if(!data || error || data?.length === 0) {
			return products_data
		}

		// uploadFile(image, `${pageId.toString()}/${data[0].id.toString()}`)

		products_data.push(data[0].id)
	}

	return products_data
}

export default createProducts