const express = require('express')
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 5000;
//midlewire
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Ema Jhon Server Run!!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v5o4n4b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });
async function run() {
    try {
        const productCollection = client.db('emaJhon2').collection('products')
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count, products })
        })
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))


app.listen(port, () => {
    console.log('My Server is Run', port);
})