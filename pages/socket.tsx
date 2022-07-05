import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import useBridge from '../hooks/useBridge'

const Socket = () => {
	const [provider, setProvider] = useState<any>()
	const [signer, setSigner] = useState<any>()
	const [json, setJson] = useState<any>()

	const connectETH = async () => {
		const providerE = new ethers.providers.Web3Provider(window.ethereum as InjectedProviders, "any");
		await providerE.send("eth_requestAccounts", []);
		const signerE = await providerE.getSigner();
		console.log(await signerE.getAddress())
		setProvider(providerE)
		setSigner(signerE)
	}

	useEffect(() => {
		connectETH()
	}, [])

	const [bridges, dex, getFees, getPoolInfo] = useBridge()

	useEffect(() => {
		(async() => {
			console.log(bridges, dex)
			console.log(await getFees('1', '137', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '200000000000000000'))
			console.log(await getPoolInfo('1', '137', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))
		})()
	}, [])

	return (
		<div>
			<button>
				Connect Socket
			</button>
		</div>
	)
}

export default Socket