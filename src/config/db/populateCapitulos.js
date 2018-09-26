const URL_DB = 'mongodb://localhost/ppl_development_v2'
const db = require('./')
const capitulos = require('./capitulos.json')

const ingresarCapitulos = async () => {
  console.log('Comenzando')
  try {
    const conn = await db.Conectar(URL_DB)
    for (let capitulo of capitulos) {
      let cap = new conn.models.Capitulos(capitulo)
      console.log(cap.nombre)
      await cap.Crear()
    }
    console.log('Done')
    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(-1)
  }
}

ingresarCapitulos()