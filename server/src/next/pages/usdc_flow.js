import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton, TextInput, SubmitButton } from '../components/misc.js'
import Router from 'next/router'
import {paymentTokenMultiplier, ABI, CONTRACT_ADDRESS, USDC_PROXY_ABI, USDC_CONTRACT_ADDRESS} from '../../lib/misc.js'
import { useSendTransaction, useContractFunction } from '@usedapp/core'
import Web3 from 'web3'
import React, { useState, useEffect } from 'react';


export default function MainPage() {
    const { activateBrowserWallet, account } = useEthers()

    const setupApproval =  async () => {
        const mmWeb3 = new Web3(window.ethereum);
        const contract = new mmWeb3.eth.Contract(USDC_PROXY_ABI, USDC_CONTRACT_ADDRESS)
        debugger
        console.log("Calling allowance: ")
        const result = await contract.methods.allowance(
            account, // owner
            USDC_CONTRACT_ADDRESS, // spender:
        ).call(function(error, result) {
            console.log("Result from allowance check: ", result)
            if( result === 0 ) {
                contract.methods.approve(
                    USDC_CONTRACT_ADDRESS,
                    Math.pow(10, 12)
                ).send({
                    from: account,
                    gasPrice: '40000000000'
                }).on('receipt', (receipt) => {
                    console.log("CONTRACT RESPONSE>>>", receipt)
                }).catch((error) => {
                    alert('error - see console')
                    console.log(error)
                })
            }
        })

    }

    const removeApproval =  async () => {
        const mmWeb3 = new Web3(window.ethereum);
        const contract = new mmWeb3.eth.Contract(USDC_PROXY_ABI, USDC_CONTRACT_ADDRESS)
        console.log("Calling decreaseAllowance: ")
        contract.methods.decreaseAllowance(
            USDC_CONTRACT_ADDRESS,
            Math.pow(10, 12)
        ).send({
            from: account,
            gasPrice: '40000000000'
        }).on('receipt', (receipt) => {
            console.log("CONTRACT RESPONSE>>>", receipt)
        }).catch((error) => {
            alert('error - see console')
            console.log(error)
        })
    }


    return (
        <>
            <div className='container mx-auto'>
                <h3>Setup USDC Approval</h3>
                {account ? <>
                        <p>Account: {account}</p>
                        <TextButton onClick={() => setupApproval()}>Setup USDC Approval</TextButton>
                        <TextButton onClick={() => removeApproval()}>Remove USDC Approval</TextButton>
                    </> : <div>
                    <TextButton onClick={() => activateBrowserWallet()}>Connect wallet</TextButton>
                </div>}

            </div>

        </>
    )
}
