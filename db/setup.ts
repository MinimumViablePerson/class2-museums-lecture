import Database from 'better-sqlite3'

const db = Database('./db/data.db', { verbose: console.log })

const museums = [
  {
    name: 'The Getty',
    city: 'Los Angeles'
  },
  {
    name: 'Smithsonian national air and space museum',
    city: 'Washington, D.C.'
  },
  {
    name: 'Louver museum',
    city: 'Paris'
  },
  {
    name: 'The British Museum',
    city: 'London, UK'
  },
  {
    name: 'Rijksmuseum',
    city: 'Amsterdam, Netherlands'
  }
]

const works = [
  {
    name: 'Mona Lisa',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gioconda_%28copia_del_Museo_del_Prado_restaurada%29.jpg/800px-Gioconda_%28copia_del_Museo_del_Prado_restaurada%29.jpg'
  },
  {
    name: 'PARTHENON MARBLES',
    picture:
      'https://cdn.shortpixel.ai/spai/w_634+q_lossy+ret_img+to_webp/https://www.untoldmorsels.com/wp-content/uploads/2017/02/Parthenon-marbles-Elgin-marbles-freize.jpg'
  },
  {
    name: 'Venus de Milo',
    picture: 'https://cdn.pariscityvision.com/library/image/5495.jpg'
  },
  {
    name: 'The Birth of Venus',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/640px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg'
  },
  {
    name: 'The Gulf Stream',
    picture:
      'https://thetourguy.com/wp-content/uploads/2020/03/Gulf-Stream-by-Winslow-Homer.jpeg'
  },
  {
    name: 'Julie Le Brun Looking In A Mirror',
    picture:
      'https://thetourguy.com/wp-content/uploads/2020/03/Julie-Le-Brun-by-Elisabeth-Louise-Vige%CC%81e-Le-Brun.jpeg'
  }
]

const exhibitions = [
  {
    museumId: 1,
    workId: 1,
    startDate: '01/12/2022',
    room: '2'
  },
  {
    museumId: 1,
    workId: 2,
    startDate: '01/01/2023',
    room: '3'
  },
  {
    museumId: 1,
    workId: 3,
    startDate: '20/12/2022',
    room: 'Violet'
  },
  {
    museumId: 2,
    workId: 1,
    startDate: '15/03/2023',
    room: 'Orange'
  },
  {
    museumId: 2,
    workId: 2,
    startDate: '01/05/2023',
    room: null
  },
  {
    museumId: 2,
    workId: 4,
    startDate: '19/05/2023',
    room: null
  }
]

// Museum stuff

const dropMuseumsTable = db.prepare(`
DROP TABLE IF EXISTS museums;
`)
dropMuseumsTable.run()

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
  id INTEGER,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
createMuseumsTable.run()

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (@name, @city);
`)

for (let museum of museums) createMuseum.run(museum)

// Works stuff

const dropWorksTable = db.prepare(`
DROP TABLE IF EXISTS works;
`)
dropWorksTable.run()

const createWorksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
  id INTEGER,
  name TEXT NOT NULL,
  picture TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
createWorksTable.run()

const createWork = db.prepare(`
INSERT INTO works (name, picture) VALUES (@name, @picture);
`)
for (let work of works) createWork.run(work)

// What links them together?

const dropMuseumWorksTable = db.prepare(`
DROP TABLE IF EXISTS museumWorks;
`)

dropMuseumWorksTable.run()

const createExhibitionTable = db.prepare(`
CREATE TABLE IF NOT EXISTS exhibitions (
  id INTEGER,
  museumId INTEGER,
  workId INTEGER,
  startDate TEXT NOT NULL,
  room TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (museumId) REFERENCES museums(id) ON DELETE CASCADE,
  FOREIGN KEY (workId) REFERENCES works(id) ON DELETE CASCADE
);
`)

createExhibitionTable.run()

const createExhibition = db.prepare(`
INSERT INTO exhibitions (museumId, workId, startDate, room) VALUES (@museumId, @workId, @startDate, @room);
`)

for (let exhibition of exhibitions) createExhibition.run(exhibition)
