import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"
import { myContract, web3 } from '../lib/misc.js';
import { create } from 'ipfs-http-client';
import { randomWord } from "../lib/words.js";

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
  }).sort({ '_id': -1 }).limit(20).toArray()
  res.json(tasks)
})

routes.route('/allTasksNoLimit').get(async (req, res) => {
  const db = await getDb()
  const tasks = await db.collection('tasks').find({
  }).sort({ '_id': -1 }).toArray()
  res.json(tasks)
})

routes.route('/myTasks/:addr').get(async (req, res) => {
  const addr = req.params.addr
  const db = await getDb()
  const tasks = await db.collection('tasks').find({
    owner: addr,
  }).sort({ '_id': -1 }).toArray()
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


routes.route('/getVerifyTask').get(async (req, res) => {
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const db = await getDb()
  const submission = await db.collection('submissions').findOne({ verified: false, inVerification: false })
  if (submission) {
    // db.collection('submissions').updateMany({ taskId: submission.taskId, submissionId: submission.submissionId }, { $set: { inVerification: true } })
    const text = (await db.collection('tasks').findOne({ taskId: submission.taskId })).text
    let options = [text, randomWord(), randomWord(), randomWord()]
    shuffle(options)
    res.json({
      taskId: submission.taskId,
      submissionId: submission.submissionId,
      ipfsHash: submission.ipfsHash,
      options: options
    })
  } else {
    res.json(null)
  }
})

routes.route('/verifyTask').post(async (req, res) => { // taskId, submissionId, answer
  const db = await getDb()
  console.log('body:', req.body)
  const taskId = parseInt(req.body.taskId)
  const submissionId = parseInt(req.body.submissionId)
  const answer = req.body.option
  if (!answer) {
    res.json('did not receive answer')
    return
  }
  const task = await db.collection('tasks').findOne({ taskId: taskId })
  const submission = await db.collection('submissions').findOne({ taskId: taskId, submissionId: submissionId })
  if (!submission) {
    res.json('cannot find submission: ', taskId, submissionId)
    return
  }
  if (submission.verified) {
    res.json('already verified')
  } else if (answer != task.text) {
    res.json('incorrect, correct answer was: ' + task.text + ' and you answered ' + answer)
  } else {
    db.collection('submissions').updateMany({ taskId: taskId, submissionId: submissionId }, { $set: { verified: true } })
    res.json('correct')

    try {
      const account = web3.eth.accounts.privateKeyToAccount((await getConfig()).eth_private_key);
      console.log(account)

      var encodedABI = myContract.methods.verifySubmission(taskId, submissionId).encodeABI()

      var txn = {
        from: account.address,
        to: myContract.options.address,
        gas: 800000,
        data: encodedABI,
      };
      console.log('txn: ', txn)

      var signed = await account.signTransaction(txn)
      console.log(signed)

      var sendRes = await web3.eth.sendSignedTransaction(signed.rawTransaction)

      console.log(sendRes)
    } catch (err) {
      console.log(err)
    }

  }
})

routes.route('/ipfsUpload').post(async (req, res) => {

  /* Create an instance of the client */
  const client = create('https://ipfs.infura.io:5001/api/v0')

  // /* upload the file */
  // const added = await client.add(file)

  /* or a string */
  const added = await client.add(Buffer.from(req.body.audio, 'base64'))

  res.json({ipfsHash: added.path})

})



routes.route('/clear-lockout').get(async (req, res) => {

  // if ((await getConfig()).develop !== true) {
  //   res.json("not allowed in prod mode")
  // }

  const db = await getDb()

  res.json({
    res: await db.collection('tasks').updateMany(
      {},
      { $set: { completedBy: [] } }
    )
  })
})


routes.route('/clear-in-verification').get(async (req, res) => {

  // if ((await getConfig()).develop !== true) {
  //   res.json("not allowed in prod mode")
  // }

  const db = await getDb()

  res.json({
    res:  await db.collection('submissions').updateMany({  }, { $set: { inVerification: false } })

  })
})


routes.route('/generate-tasks').get(async (req, res) => {

  // if ((await getConfig()).develop !== true) {
  //   res.json("not allowed in prod mode")
  // }

  for (let i = 0; i < 100; i++) {

    setTimeout(async function () {
      try {

        const account = web3.eth.accounts.privateKeyToAccount((await getConfig()).eth_private_key);
        console.log(account)

        var encodedABI = myContract.methods.createTask(randomWord(), Math.floor(10000 + Math.random() * 10000), 9999999999999, 20).encodeABI()

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

        console.log(sendRes)
      } catch (err) {
        console.log(err)
      }

    }, 20000 * i)

  }

  res.json('complete')

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

routes.route('/test-ipfs-upload').get(async (req, res) => {

  if ((await getConfig()).develop !== true) {
    res.json("not allowed in prod mode")
  }

  /* Create an instance of the client */
  const client = create('https://ipfs.infura.io:5001/api/v0')

  // /* upload the file */
  // const added = await client.add(file)

  /* or a string */
  const added = await client.add('hello world from mine2mine')

  res.json(added)

})

export default routes
