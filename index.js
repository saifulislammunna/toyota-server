const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

         // GET products API 
         app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);

        });
         // GET reviews API 
         app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);

        });
         // GET orders API 
         app.get('/orders', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);

        });
        // Get orders API
         app.get('/orders', async(req, res) => {
              const email = req.query.email;
             const query = {email : email};
             console.log(query)  
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);

        });
      
        // admin getting
        app.get('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                   isAdmin = true;
                   
            }
            res.send({admin:  isAdmin});
    
   
         })
 
         // Add Orders API 
         app.post('/orders', async(req,res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send('Order processed');
        });
        
        // Add Users API 
        app.post('/users', async(req,res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.send(result)
    
          });
        
    //    admin add to databse
    app.put('/users/admin',  async(req,res) =>{
        const user = req.body;
         console.log('put', user);
         
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.send(result);
       
      });
 
    
        //insert a product POST API
    app.post('/products', async(req, res) => {

        const product = req.body;
        console.log('hit the post api',product);
        
        const result = await productCollection.insertOne(product);
         console.log(result);
       res.send(result);
      });  

      
        //insert a product POST API
    app.post('/reviews', async(req, res) => {
        const review = req.body;
        console.log('hit the post api', review);
        const result = await reviewsCollection.insertOne(review);
         console.log(result);
       res.send(result);
      });  
  

       // DELETE API
       app.delete('/orders/:_id', async(req,res) =>{
        const id = req.params._id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.json(result);

      })
       // DELETE API
       app.delete('/products/:_id', async(req,res) =>{
        const id = req.params._id;
        const query = {_id:ObjectId(id)};
        const result = await  productCollection.deleteOne(query);
        res.json(result);

      })
      
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
