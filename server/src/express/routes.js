import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"
import { myContract, web3 } from '../lib/misc.js';

export const routes = Router()

routes.route('/users/:addr/getTask').get(async (req, res) => {
  const addr = req.params.addr
  const db = await getDb()
  const cursor = db.collection('tasks').find({
    $and: [
      { remainingQuantity: { $gte: 1 } },
      { completedBy: { $ne: addr } }
    ]
  }).sort({ 'bid': -1 }).limit(1)
  if (!(await cursor.hasNext())) {
    res.json(null)
  } else {
    const task = await cursor.next();
    await db.collection('tasks').updateOne(
      { taskId: task.taskId },
      { $push: { completedBy: addr } }
    )
    res.json(task)
  }
})


routes.route('/allTasks').get(async (req, res) => {
  const db = await getDb()
  const tasks = await db.collection('tasks').find({
  }).sort({ 'bid': -1 }).limit(20).toArray()
  res.json(tasks)
})


routes.route('/tasks/:taskId/submissions').get(async (req, res) => {
  const db = await getDb()
  const taskId = parseInt(req.params.taskId)
  console.log('finding submissions for taskId: ', taskId)
  const submissions = await db.collection('submissions').find({
    taskId: taskId
  }).sort({ _id: 1 }).toArray()
  res.json(submissions)
})

routes.route('/test-sc-call').get(async (req, res) => {

  if ((await getConfig()).develop !== true) {
    res.json("not allowed in prod mode")
  }

  const account = web3.eth.accounts.privateKeyToAccount((await getConfig()).eth_private_key);
  console.log(account)

  var encodedABI = myContract.methods.createTask('pasta', 1, 9999999999999, 1).encodeABI()

  var txn = {
    from: account.address,
    to: myContract.options.address,
    gas: 500000,
    data: encodedABI,
  };
  console.log('txn: ', txn)

  var signed = await account.signTransaction(txn)
  console.log(signed)

  var sendRes = await web3.eth.sendSignedTransaction(signed.rawTransaction)

  res.json(sendRes)

})

export default routes
