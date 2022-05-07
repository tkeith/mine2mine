import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton, TextInput, SubmitButton } from '../components/misc.js'
import Router from 'next/router'
import { paymentTokenMultiplier, ABI, CONTRACT_ADDRESS } from '../../lib/misc.js'
import { useSendTransaction, useContractFunction } from '@usedapp/core'
import Web3 from 'web3'

export default function MainPage() {
  const { activateBrowserWallet, account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const createTask = async event => {
    event.preventDefault()

    const mmWeb3 = new Web3(window.ethereum);
    const contract = new mmWeb3.eth.Contract(ABI, CONTRACT_ADDRESS)

    contract.methods.createTask(event.target.text.value, Math.floor(parseFloat(event.target.bid.value) * paymentTokenMultiplier), Math.floor(Date.now() / 1000 + parseInt(event.target.duration.value)), parseInt(event.target.quantity.value)
    ).send({
      from: account,
      gasPrice: '40000000000'
    }).on('receipt', (receipt) => {
      console.log(receipt)
      Router.reload()
    }).catch((error) => {
      alert('error - see console')
      console.log(error)
    })
  }
 
  return (
    <div>
      {account ? <>
        <p>Account: {account}</p>
        <form onSubmit={createTask}>
          <TextInput label='Text' name='text' />
          <TextInput label='Bid' name='bid' />
          <TextInput label='Quantity' name='quantity' />
          <TextInput label='Duration of Bid (in seconds)' name='duration' />
          <SubmitButton>Create task</SubmitButton>
          <SubmitButton>Submitting</SubmitButton>
        </form>
      </> : <div>
        <TextButton onClick={() => activateBrowserWallet()}>Connect wallet</TextButton>
      </div>}
    </div>
  )
}
