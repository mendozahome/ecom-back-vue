import express from "express"
import { cartItems as cartItemsRaw, products as productsRaw } from './../temp-data'
import cors from "cors"
import { connectToDb, getDb } from "./index";

require('dotenv').config()


let cartItems = cartItemsRaw;
let products = productsRaw;

// db connection 
let db
connectToDb((err) => {
if(!err){
app.listen(8000, () => {
console.log('server is listening on port 8000')
    })
    db = getDb()
}
})


const app = express()
app.use(express.json())
app.use(cors())


app.get('/hello', (req, res) =>{
    let items = [];
    db.collection(process.env.MONGO_COLLECTION)
    .find()   // cursor toArray forEach
    .sort({ name: 1})
    .forEach(item =>  items.push(item))
    .then(() =>{
        res.status(200).json(items)
    })
    .catch(() => {
        res.status(500).json({error: 'could not fetch the document'})
    })

});

app.get('/products', (req, res) =>{
    res.json(products)
})

function populateCartIds(ids){
    return ids.map(id => products.find(product => product.id === id) )
}

app.get('/cart', (req, res) =>{
    const populatedCart = populateCartIds(cartItems)
    res.json(populatedCart)
})

app.get('/products/:productId', (req, res) =>{
    const productId = req.params.productId;
    const product = products.find(product => product.id === productId);
    res.json(product)
})

app.post('/cart', (req, res) => {
    const productId = req.body.id;
    cartItems.push(productId);
    const populateCart = populateCartIds(cartItems)
    res.json(populateCart);
})

app.delete('/cart/:productId', (req,res) =>{
    const productId = req.params.productId;
    cartItems = cartItems.filter(id => id !== productId)
    const populateCart = populateCartIds(cartItems)
    res.json(populateCart)
})

