import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable"

const createCoffeeStore = async (req, res) => {

  if (req.method === 'POST') {
    const {id, name, address, voting, imgUrl} = req.body

    try {
      // find
      if (id) {
        const records = await findRecordByFilter(id)

      if (records.length !== 0) {
        res.json(records)
      } else {
          // create
          if (name) {
            const createdRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  voting,
                  imgUrl,
                }
              }
            ])
    
            const records = getMinifiedRecords(createdRecords)
            res.json({ records })
          } else {
            res.status(400)
            res.json({ message: 'Id or name is missing' })
          }
        }
      } else {
        res.status(400)
        res.json({ message: 'Id is missing' })
      }
    }
    catch (err) {
      res.status(500)
      res.json({ message: 'Error creating or finding a store', err })
    }
  }
}

export default createCoffeeStore