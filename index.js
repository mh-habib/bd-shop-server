const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;


//Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9gzn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("shop-store").collection("products");
    const ordersCollection = client.db("shop-store").collection("orders");

    app.get('/products', (req, res)=>{
        productsCollection.find({})
        .toArray((err, items) =>{
            res.send(items)
        })
    })

    app.get('/allOrders', (req, res)=>{
        ordersCollection.find({email: req.query.email})
        .toArray((err, items) =>{
            res.send(items)
        })
    })

    app.get('/product/:id', (req, res)=>{
        productsCollection.find({_id: ObjectID(req.params.id)})
        .toArray((err, items) =>{
            res.send(items)
        })
    })

    app.post('/addProduct', (req, res)=>{
        const newProduct = req.body;
        // console.log('Add to server:', newProduct);
        productsCollection.insertOne(newProduct)
        .then(result => {
            // console.log('inserted count:', result.insertedCount)
            res.send(result.insertedCount>0)
        }) 
    })

    app.post('/sendOrder', (req, res)=>{
        const newOrder = req.body;
        // console.log('Add to server:', newOrder);
        ordersCollection.insertOne(newOrder)
        .then(result => {
            // console.log('inserted count:', result.insertedCount)
            res.send(result.insertedCount>0)
        }) 
    })

    app.delete("/delete/:id", (req, res)=>{
        // console.log(req.params.id);
        productsCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result =>{
        //   console.log(result);
          res.send(result.deletedCount>0)
        })
    })

    //client.close();
});


app.get('/', (req, res) => {
    res.send('Hello, I am Working');
})

app.listen(port)