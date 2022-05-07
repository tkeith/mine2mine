import getDb from "../../../lib/db"

export default function handler(req, res) {
  if (req.method == 'GET') {
    getDb()
      .then(db =>
        db.collection('test').findOne({})
      )
      .then(row =>
        res.json({ text: row?.text || "no data yet" })
      )
      .catch(err =>
        console.log(err)
      )
  } else if (req.method == 'POST') {
    getDb()
      .then(db =>
        db.collection('test').updateOne(
          {},
          { $set: { text: req.body.text } },
          { upsert: true, })
      )
      .then(() =>
        res.json()
      )
  }
}
