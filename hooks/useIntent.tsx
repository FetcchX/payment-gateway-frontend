import toast from "react-hot-toast"

const useIntent = () => {
	const updateIntent = async (intent_data: object) => {
		const data = await fetch(`https://wagpay.club/api/paymentIntents/`, {
			method: 'PATCH',
			body: JSON.stringify(intent_data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		if(data.status >= 400) toast.error("Can't talk with backend")
	}

	return [updateIntent] as any
}

export default useIntent