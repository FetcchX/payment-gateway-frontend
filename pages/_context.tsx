import { useEffect, FC, createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export interface Context {
  config: any
  qrCode: any
  qrCodes: any
  url: string
  setUrl: Function
  isModalOpen: boolean
  setIsModalOpen: Function
  setQrCode: Function
  ref: any
}

export const AppContext = createContext<Context>({} as Context);

export function useAccountContext() {
  return useContext(AppContext);
}

export default function () {
  const [{ data, error, loading }, disconnect] = useAccount()
  return <div></div>;
}