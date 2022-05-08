import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton, TextInput, SubmitButton } from '../components/misc.js'
import Router from 'next/router'
import { paymentTokenMultiplier, ABI, CONTRACT_ADDRESS } from '../../lib/misc.js'
import { useSendTransaction, useContractFunction } from '@usedapp/core'
import Web3 from 'web3'
import React, { useState, useEffect } from 'react';
let updateTasks


export default function MainPage() {
  const { activateBrowserWallet, account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const [tasks, updateTasks] = useState([])


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
      <td>{task.text}</td>
      <td>{task.bid}</td>
      <td>{task.originalQuantity}</td>
      <td>{task.remainingQuantity}</td>
      <td>{task.creator}</td>
      <td><a href={'/tasks/' + task.taskId}>Submissions</a></td>
    </tr>
  )

  const table = (
    <table>
      <thead>
        <tr>
          <th>Text</th>
          <th>Bid</th>
          <th>Orig qty</th>
          <th>Rem qty</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )

  return <>
    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen'>
      <div className='justify-center  items-center flex'>
          <div className='border-3 border-gray-100 bg-gray-100 rounded-2xl ml-10 mr-10 w-fit m-12'>
          <div>

            {account ? <>
              <p>Account: {account}</p>
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
          <div className='border-3 border-gray-100 bg-gray-100 rounded-2xl ml-10 mr-10 w-fit m-12'>
              <h1>Tasks</h1>
          {table}
          </div>
      </div>
    </div>
  </>
}
