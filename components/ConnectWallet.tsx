import { useState, useEffect } from "react";
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import ActionButton from "./forms/ActionButton"

type Props = {
    isXs?: boolean;
}

const ConnectWallet = ({ isXs = false }: Props) => {
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { data: session, status } = useSession()

    // useEffect(() => {
    //     if (isConnected && !session) {
    //         login()
    //     }
    // }, [isConnected])

    function handleLogin() {
        if (!isConnected) {
            connect()
        } else {
            login()
        }
    }

    const login = async () => {
        try {
            const callbackUrl = "/"
            const walletAddress = address
            const chainId = chain?.id
            const nonce = await getCsrfToken()
            const message = new SiweMessage({
                domain: window.location.host,
                address: walletAddress,
                statement: "Sign in with Ethereum to the app.",
                uri: window.location.origin,
                version: "1",
                chainId: chainId,
                nonce: nonce,
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })
            signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ActionButton value="Sign In" color="primary" isXs={isXs} isBordered={false} isLoading={false} onClickEvent={handleLogin} />
    )
}

export default ConnectWallet;
