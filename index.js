const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()


const cors = require('cors');
require('dotenv').config()

const app = express()
const port =  process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6dke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected');
        const database = client.db('toyota');


        const productCollection = database.collection('products');
        const orderCollection  = database.collection('orders');

         // GET services API 
         app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);




         // Add Orders API 
         app.post('/orders', async(req,res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send('Order processed');
        })

        });
    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
