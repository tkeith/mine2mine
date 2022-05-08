import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton, TextInput, SubmitButton } from '../components/misc.js'
import Router from 'next/router'
import { paymentTokenMultiplier, ABI, CONTRACT_ADDRESS } from '../../lib/misc.js'
import { useSendTransaction, useContractFunction } from '@usedapp/core'
import Web3 from 'web3'
import React, { useState, useEffect } from 'react';
import { USDC_PROXY_ABI, USDC_CONTRACT_ADDRESS } from '../../lib/misc.js'


export default function MainPage() {
  const { activateBrowserWallet, account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const [tasks, updateTasks] = useState([])


  const setupApproval = async () => {
    const mmWeb3 = new Web3(window.ethereum);
    const contract = new mmWeb3.eth.Contract(USDC_PROXY_ABI, USDC_CONTRACT_ADDRESS)
    // console.log("Calling allowance: ")
    // await contract.methods.allowance(
    //   account, // owner
    //   USDC_CONTRACT_ADDRESS, // spender:
    // ).call(function (error, result) {
    //   console.log("Result from allowance check: ", result)
    //   if (result === 0) {
    //     contract.methods.approve(
    //       USDC_CONTRACT_ADDRESS,
    //       100000000000
    //     ).send({
    //       from: account,
    //       gasPrice: '40000000000'
    //     }).on('receipt', (receipt) => {
    //       console.log("CONTRACT RESPONSE>>>", receipt)
    //     }).catch((error) => {
    //       alert('error - see console')
    //       console.log(error)
    //     })
    //   }
    // })
    contract.methods.approve(
      CONTRACT_ADDRESS,
      100000000000
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


  // async function getTasks() {
  //   const res = await fetch('/express/allTasks', {
  //     method: 'GET'
  //   })

  //   return await res.json()
  // }

  // async function populateNewTasks () {
  //   if (updateTasks) {
  //     updateTasks(await getTasks())
  //   }
  // }

  //  useEffect(() => {
  //   populateNewTasks()
  // }, []
  // )

  // useEffect(() => {
  //   return function () { setInterval(populateNewTasks, 1000) }
  // }, []
  // )


  useEffect(function () {
    (async () => {
      const res = await (await fetch('/express/allTasks', {
        method: 'GET'
      })).json()
      updateTasks(res)
    })()
  }, [])



  const rows = tasks.map((task) =>
    <tr key={task.taskId}>
      <td className='text-left p-2'>{task.taskId}</td>
      <td className='text-left p-2'>{task.text}</td>
      <td className='text-left p-2'>{task.bid}</td>
      <td className='text-left p-2'>{task.originalQuantity}</td>
      <td className='text-left p-2'>{task.remainingQuantity}</td>
      <td className='text-left p-2'><a href={'/tasks/' + task.taskId}>Submissions</a></td>
    </tr>
  )

  const table = (
    <table>
      <thead>
        <tr>
          <th className='text-left p-2 w-48'>ID</th>
          <th className='text-left p-2 w-48'>Text</th>
          <th className='text-left p-2 w-48'>Bid</th>
          <th className='text-left p-2 w-48'>Orig qty</th>
          <th className='text-left p-2 w-48'>Rem qty</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )

  return <>
    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 text-white'>
      <div style={{ width: '800px', margin: '0 auto', padding: '100px', border: 'solid 1px gray', padding: '20px' }}>
          <div>

            {account ? <>
            <h1 className='text-xl'>Account: {account}</h1>
              <p className='h-2'></p>
              <p>
              <TextButton onClick={() => setupApproval()}>Setup USDC Approval</TextButton>
              </p>
              <p className='h-2'></p>

              <form onSubmit={createTask}>
                <TextInput label='Text' name='text' />
                <TextInput label='Bid' name='bid' />
                <TextInput label='Quantity' name='quantity' />
                <TextInput label='Duration of Bid (in seconds)' name='duration' />
                <SubmitButton>Create task</SubmitButton>
              </form>
            </>  :<div>
              <TextButton onClick={() => activateBrowserWallet()}>Connect wallet</TextButton>
            </div>}

            </div>
          </div>
      <div style={{ width: '800px', margin: '0 auto', padding: '100px', border: 'solid 1px gray', padding: '20px' }}>
              <h1 className='text-xl'>Tasks</h1>
          {table}
          </div>
      </div>
  </>
}
