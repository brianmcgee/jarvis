import pino from 'pino'
import pinoPretty from 'pino-pretty'

export default pino({
    prettyPrint: {
        levelFirst: true,
        suppressFlushSyncWarning: true,
    },
    prettifier: pinoPretty,
})
