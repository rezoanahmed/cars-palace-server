const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
require('dotenv').config()
// middlewares
app.use(cors())
app.use(express.json())

// mongo db

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.5fxcqx1.mongodb.net/?retryWrites=true&w=majority`;

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


    // create database
    const carCollection = client.db("CarDB").collection("cars");
    const brands = client.db("CarDB").collection("brands");
    const cart = client.db("CarDB").collection("cart");

    // CRUD - CREATE
    app.post("/cars", async (req, res) => {
      const car = req.body;
      // console.log(car);
      const result = await carCollection.insertOne(car)
      res.send(result);
    })

    // CRUD - READ
    app.get("/cars", async (req, res) => {
      const cars = await carCollection.find().toArray();

      res.send(cars);
    })
    // find cars by brand name
    app.get("/cars/:name", async (req, res) => {
      const carName = req.params.name;
      const query = { brand: carName };
      const cars = await carCollection.find(query).toArray();
      res.send(cars);
    });

    // find specific car by id
    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    })




    // brands
    app.get("/brands", async (req, res) => {
      const result = await brands.find().toArray();
      res.send(result);
    })

    // cart
    app.post("/cart", async(req,res)=>{
      const item = req.body;
      // console.log(item);
      const result = await cart.insertOne(item);
      res.send(result);
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


app.get("/", (req, res) => {
  const message = "This server is working";
  res.send(message);
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})
