import { MongoClient } from "mongodb"

const connectDb = async () => {
  const conn = await MongoClient.connect('mongodb://app:app@mongo:27017/')
  return conn.db("app")
}

let connPromise

const getDb = () => {
  if (!connPromise) {
    connPromise = connectDb()
  }
  return connPromise
}

export default getDb
