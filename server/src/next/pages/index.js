import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton, TextInput, SubmitButton } from '../components/misc.js'
import Router from 'next/router'
import { paymentTokenMultiplier, ABI, CONTRACT_ADDRESS } from '../../lib/misc.js'
import { useSendTransaction, useContractFunction } from '@usedapp/core'
import Web3 from 'web3'
import React, { useState, useEffect } from 'react';

let updateTasks = function (tasks) { }

function TasksTable() {

  const [tasks, _updateTasks] = useState([])

  useEffect(() => {
    /* Assign update to outside variable */
    updateTasks = _updateTasks

    /* Unassign when component unmounts */
    return () => updateTasks = null
  })


  const rows = tasks.map((task) =>
    <tr key={ task.taskId }>
      <td>{task.text}</td>
      <td>{task.bid}</td>
      <td>{task.originalQuantity}</td>
      <td>{task.remainingQuantity}</td>
      <td><a href={'/tasks/' + task.taskId}>Submissions</a></td>
    </tr>
  )

  return (
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

}

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

  let tasks = []

  async function getTasks() {
    const res = await fetch('/express/allTasks', {
      method: 'GET'
    })

    return await res.json()
  }

  async function populateNewTasks () {

    updateTasks(await getTasks())

  }

  useEffect(() => {
    setInterval(populateNewTasks, 1000)
  }, []
  )

  return (
    <div className='container mx-auto'>
      <h3>New task</h3>
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

      <h3>Tasks</h3>
      <TasksTable />
    </div>
  )
}
