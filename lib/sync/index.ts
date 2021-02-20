import asana from './asana'

async function sync() {
    await asana.fullSync()
    process.exit(0)
}

sync()
