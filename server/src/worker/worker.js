import getDb from "../lib/db.js"
import { myContract, web3 } from '../lib/misc.js';

// const web3 = new Web3('https://polygon-rpc.com/');

// const ABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "submissionId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" }], "name": "SubmissionCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "string", "name": "text", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "bid", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "expiresAt", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "TaskCreated", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }], "name": "createSubmission", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256", "name": "bid", "type": "uint256" }, { "internalType": "uint256", "name": "expiresAt", "type": "uint256" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "createTask", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }]

// const CONTRACT_ADDRESS = '0x51797a758376671eA20f0Ace40c8DF7EcD72bc97'
// const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS)

async function checkForNewEvents() {
  console.log('getting db')
  const db = await getDb()

  const scanOptions = {
    fromBlock: (await web3.eth.getBlockNumber()) - 500,
    toBlock: 'latest'
  }

  console.log('getting task creations')

  try {
    var taskCreatedEvents = await myContract.getPastEvents('TaskCreated', scanOptions)
  } catch (err) {
    console.log('failed to get events')
    return
  }

  console.log('handling task creations')

  for (const event of taskCreatedEvents) {
    const taskId = parseInt(event.returnValues[0]);
    const creator = event.returnValues[1];
    const text = event.returnValues[2];
    const bid = parseInt(event.returnValues[3]);
    const expiresAt = parseInt(event.returnValues[4]);
    const quantity = parseInt(event.returnValues[5]);

    if (!(await db.collection('tasks').findOne({ taskId: taskId }))) {
      // this is a new task, not already registered
      const newTask = {
        taskId: taskId,
        creator: creator,
        text: text,
        bid: bid,
        expiresAt: expiresAt,
        originalQuantity: quantity,
        remainingQuantity: quantity,
        completedBy: []
      }
      console.log('found new task:', newTask)
      await db.collection('tasks').insert(newTask)
    }
  }

  console.log('getting submission creations')

  try {
    var submissionCreatedEvents = await myContract.getPastEvents('SubmissionCreated', scanOptions)
  } catch (err) {
    console.log('failed to get events')
    return
  }

  console.log('handling submission creations')

  for (const event of submissionCreatedEvents) {
    const taskId = parseInt(event.returnValues[0]);
    const submissionId = parseInt(event.returnValues[1]);
    const creator = event.returnValues[2];
    const ipfsHash = event.returnValues[3];

    if (!(await db.collection('submissions').findOne({ taskId: taskId, submissionId: submissionId }))) {
      await db.collection('tasks').updateOne(
        { taskId: taskId },
        { $inc: { remainingQuantity: -1 } }
      )
      await db.collection('submissions').insert({
        taskId: taskId,
        submissionId: submissionId,
        creator: creator,
        ipfsHash: ipfsHash,
        verified: false,
        inVerification: false
      })
    }
  }
}

setInterval(checkForNewEvents, 5000)
