import Moongose from 'mongoose'

async function dbConnect() {
	if(Moongose.connection.readyState >= 1) {
		return
    }
    
	const password = process.env.MONGODB_PASSWORD
    const username = process.env.MONGODB_USERNAME
	const dbUrl = `mongodb+srv://${username}:${password}@cluster0.yptboqt.mongodb.net/`

	try {
		const conn = await Moongose.connect(dbUrl)
		console.log(`MongoDB connected: ${conn.connection.host}`)
	} catch(error) {
		console.error(error)
	}
}

export default dbConnect