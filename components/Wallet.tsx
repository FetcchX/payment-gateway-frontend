import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useConnect, useAccount, useSignMessage } from 'wagmi'

interface Props {
  walletModal: boolean
  setWalletModal: Function
}

export default function ConnectWallet({ walletModal, setWalletModal }: Props) {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [message, setMessage] = useState('Sign this to allow wagpay to store data offchain')
  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  const signToLoadDataOffChain = () => {
	  if(accountData) {
      if(!signLoading) {
        signMessage({ message }).then(d => console.log(d))
      }
	  }
  }

  useEffect(() => {
    if(connectData.connected) {
      signToLoadDataOffChain()
    }
  }, [connectData.connected])

  if (accountData) {
    return (
      <div>
        <img src={accountData.ens?.avatar as string} alt="ENS Avatar" />
          <div>
            {accountData.ens?.name
              ? `${accountData.ens?.name} (${accountData.address})`
              : accountData.address}
          </div>
        <div>Connected to {accountData?.connector?.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  const change = () => {
    console.log(walletModal)
    setWalletModal(false)
    console.log(walletModal)
  }

  useEffect(() => {
    console.log(walletModal)
  }, [walletModal])

  return (
    <div className={(walletModal ? ' ' : 'hidden ') + ' flex space-x-4 absolute top-0 bottom-0'}>
      {connectData.connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect(connector)}>
          {connector.name}
          {!connector.ready && <span>'(unsupported)'</span>}
        </button>
      ))}
      {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
    </div>
  )
}
