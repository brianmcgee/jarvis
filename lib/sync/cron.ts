import cron from 'node-cron'
import asana from './asana'

cron.schedule('*/1 * * * *', async () => {
    await asana.fullSync()
})
