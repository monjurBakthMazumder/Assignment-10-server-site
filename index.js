const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASS}@cluster0.ib5iccz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brand");
    const productCollection = client.db("brandDB").collection("product");
    const orderCollection = client.db("brandDB").collection("order");

    app.get("/brand",async(req, res)=> {
        const result = await brandCollection.find().toArray()
        res.send(result)
    })

    app.get('/products/:brand', async(req,res)=> {
      const brand = req.params.brand
      const filter = {brand: brand}
      const result = await productCollection.find(filter).toArray()
      res.send(result)
    })

    app.get('/product/:id', async(req,res)=> {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await productCollection.find(filter).toArray()
      res.send(result)
    })

    app.post('/products', async(req, res)=> {
      const product = req.body
      const result = await productCollection.insertOne(product)
      res.send(result)
    })

    app.put('/product/:id', async(req,res)=> {
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const product = req.body
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name: product.name,
          brand: product.brand,
          price: product.price,
          type: product.type,
          rating: product.rating,
          description: product.description,
          img: product.img,
        }
      }
      const result = await productCollection.updateOne(filter, updateProduct, options)
      res.send(result)
    })

    app.post('/orders', async(req, res)=>{
      const order = req.body
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send("hello world")
})

app.listen(port, ()=> {
    console.log(`server running on port ${port}`);
})