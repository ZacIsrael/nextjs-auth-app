const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {

    // constants for development
    if(phase === PHASE_DEVELOPMENT_SERVER){
        return {
            env: {
                mongodb_username: 'db-user',
                mongodb_password: 'Ramblers2018!',
                mongodb_clustername: 'cluster0',
                mongodb_database: 'auth-app-dev'
            },
        }
    }

    // constants used in production 
    return {
        env: {
            mongodb_username: 'db-user',
            mongodb_password: 'Ramblers2018!',
            mongodb_clustername: 'cluster0',
            mongodb_database: 'auth-app'
        },
    }
}
