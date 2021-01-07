function dbConnect() {

    // Db connection
    const mongoose = require('mongoose')

    // const url = process.env.MONGO_CONNECTION_URL
    const url = process.env.MONGO_CLOUD_CONNECTION_URL

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })

    const connection = mongoose.connection
    connection.once('open', function() {
        console.log('Database connected...')
    }).catch(function(err) {
        console.log('Connection failed...')
    })
}

module.exports = dbConnect