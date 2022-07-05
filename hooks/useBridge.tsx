import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useBridge = () => {
	const [bridges, setBridges] = useState(['HYPHEN'])
	const [dex, setDEX] = useState(['UNISWAP'])

	const getFees = async (fromChainId: string, toChainId: string, tokenAddress: string, amount: string) => {
		return new Promise((resolve, reject) => {
			fetch(`https://hyphen-v2-api.biconomy.io/api/v1/data/transferFee?fromChainId=${fromChainId}&toChainId=${toChainId}&tokenAddress=${tokenAddress}&amount=${amount}`)
				.then(res => res.json())
				.then(data => resolve(data))
				.catch(e => reject(e))
		})
	}

	const getPoolInfo = async (fromChainId: string, toChainId: string, tokenAddress: string) => {
		return new Promise((resolve, reject) => {
			fetch(`https://hyphen-v2-api.biconomy.io/api/v1/insta-exit/get-pool-info?fromChainId=${fromChainId}&toChainId=${toChainId}&tokenAddress=${tokenAddress}`)
				.then(res => res.json())
				.then(data => resolve(data))
				.catch(e => reject(e))
		})
	}

	return [bridges, dex, getFees, getPoolInfo] as any
}

export default useBridge