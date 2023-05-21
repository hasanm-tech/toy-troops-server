const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER)

// ====================
// ====================
// ====================


console.log()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pmje8tj.mongodb.net/?retryWrites=true&w=majority`;

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


    const toyCollections = client.db('toy-troops').collection('toys')
    const bookingCollection = client.db('toy-troops').collection('bookings')


    app.get('/toys', async (req,res) => {
        const result = await toyCollections.find().toArray() 
        res.send(result)
    })


    app.get('/toys/:id', async (req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const options = {
            projection : {
                picture:1, name:1, price:1, category:1,rating:1, quantity:1, description:1
            }
        }
        const result = await toyCollections.findOne(query,options)
        res.send(result)
    })


    // bookings 

    app.post('/bookings', async (req,res) => {
        const booking = req.body;
        console.log(booking)
        const result = await bookingCollection.insertOne(booking)
        res.send(result)
    })


    app.get('/bookings', async (req,res) => {
        const result = await bookingCollection.find().toArray()
        res.send(result)
    })

    app.get('/bookings/:id', async (req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const options = {
            projection : {
                photo:1,toyName:1, sellerName:1, price:1, subCategory:1,rating:1, quantity:1, detail:1
            }
        }
        const result = await bookingCollection.findOne(query,options)
        res.send(result)
    })


    app.get('/myToys', async (req, res) => {
        let query = {};
       if(req.query.sellerEmail){
        query = {sellerEmail : req.query.sellerEmail}
       }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
      });

      

      app.put('/bookings/:id', async (req,res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = {upsert :true}
        const updatedToy = req.body;
        const toy = {
            $set : {
                toyName : updatedToy.toyName,
                price : updatedToy.price,
                quantity : updatedToy.quantity,
                detail : updatedToy.detail,
                
            }
        }

        const result = await bookingCollection.updateOne(filter,toy,options);
        res.send(result)
      })
      

      app.delete('/bookings/:id', async (req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await bookingCollection.deleteOne(query);
        res.send(result)
      })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);






// ====================
// ====================
// ====================


app.get('/',(req,res) => {
    res.send('toy troops is running')
})

app.listen(port, () => {
    console.log(`toy is running at ${port}`)
})