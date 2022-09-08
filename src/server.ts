import Database from 'better-sqlite3'
import cors from 'cors'
import express from 'express'

const db = Database('./db/data.db', { verbose: console.log })
const app = express()
app.use(cors())
app.use(express.json())

const port = 5678

const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = @id;
`)

const getWorkById = db.prepare(`
SELECT * FROM works WHERE id = ?;
`)

const getExhibitionsForMuseum = db.prepare(`
SELECT * FROM exhibitions WHERE museumId = @museumId;
`)

const getWorksForMuseum = db.prepare(`
SELECT works.* FROM works
JOIN exhibitions ON works.id = exhibitions.workId
WHERE exhibitions.museumId = @museumId;
`)

// How many tables do I need info from: works, exhibitions
// JOIN works exhibitions
// SELECT * FROM works
// JOIN exhibitions ON work.id = exhibitions.workId
// WHERE ???? <<< any info from works AND OR exhibitions

const getMuseumsForWork = db.prepare(`
SELECT museums.* FROM museums
JOIN exhibitions ON museums.id = exhibitions.museumId
WHERE exhibitions.workId = @workId;
`)

app.get('/museums/:id', (req, res) => {
  const museum = getMuseumById.get(req.params)

  if (museum) {
    museum.exhibitions = getExhibitionsForMuseum.all({ museumId: museum.id })
    museum.works = getWorksForMuseum.all({ museumId: museum.id })
    res.send(museum)
  } else {
    res.status(404).send({ error: 'Museum not found' })
  }
})

app.get('/works/:id', (req, res) => {
  const work = getWorkById.get(req.params)

  if (work) {
    work.museums = getMuseumsForWork.all({ workId: work.id })
    res.send(work)
  } else {
    res.status(404).send({ error: 'Work not found' })
  }
})

app.listen(port, () => {
  console.log(`App running on: http://localhost:${port}`)
})
