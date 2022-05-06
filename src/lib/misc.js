import getDb from "./db.js"

export async function getTextOld() {
  return await getDb()
    .then(db =>
      db.collection('test').findOne({})
    )
    .then(row =>
      row?.text || "no data yet"
    )
    .catch(err =>
      console.log(err)
    )
}

export const getText = async () => {
  const db = await getDb()
  const row = await db.collection('test').findOne({})
  console.log(row)
  const text = row?.text || "no data yet"
  return text
}
