import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"

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


routes.route('/tasks/:taskid/submissions').get(async (req, res) => {
  const db = await getDb()
  const taskId = parseInt(req.params.taskId)
  const submissions = await db.collection('submissions').find({
    taskId: taskId
  }).sort({ _id: 1 }).toArray()
  res.json(submissions)
})

export default routes
