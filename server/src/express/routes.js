import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"
import { getText } from '../lib/misc.js'

export const routes = Router()

routes.route('/').get(async (req, res) => {
  res.json({ text: await getText() })
})

routes.route('/save').post(async (req, res) => {
  let db = await getDb()
  await db.collection('test').updateOne(
    {},
    { $set: { text: req.body.text } },
    { upsert: true, })
  res.json()
})

routes.route('/is_mongo_express_enabled').get(async (req, res) => {
  const cfg = await getConfig()
  res.json(cfg.mongo_express_enabled)
})

export default routes
