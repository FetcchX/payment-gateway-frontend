import { supabase } from "../supabase"
import { useState } from "react"
import { useRouter } from 'next/router'
import toast from "react-hot-toast"

const Auth: React.FC = () => {
	const [email, setEmail] = useState('')

	const { push } = useRouter()

	const getOrCreateUser = async (email: string) => {
		const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/user/email/${email}`)
		const user = await data.json()
		console.log(user, "USER")
		if(data.status == 400) {
			toast('Claim a username first')	
			push('/claim')
			return false
		}
		return true
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		let alreadyUser = await getOrCreateUser(email)
		if(alreadyUser) {
			const promise = supabase.auth.signIn({ email })
			toast.promise(promise, {
				loading: 'Sending Email',
				success: 'Successfully send email',
				error: "Can't send email"
			})
		}
	}

	return (
	  <div className="border rounded-lg p-12 w-11/12 lg:w-4/12 mx-auto my-48">
		<h3 className="font-extrabold text-3xl">Ahoy!</h3>
  
		<p className="text-gray-500 text-sm mt-4">
		  Fill in your email, we'll send you a magic link.
		</p>
  
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				placeholder="Your email address"
				className="border w-full p-3 rounded-lg mt-4 focus:border-indigo-500"
				onChange={e => setEmail(e.target.value)}
			/>
  
		  <button
			type="submit"
			className="bg-indigo-500 text-white w-full p-3 rounded-lg mt-8 hover:bg-indigo-700"
		  >
			Let's go!
		  </button>
		</form>
	  </div>
	)
  }
  
  export default Auth