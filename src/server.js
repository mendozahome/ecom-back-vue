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
    });

app.get('/products', (req, res) =>{
    let products = [];
    db.collection(process.env.MONGO_COLLECTION)
      .find()   // cursor toArray forEach
        .sort({ name: 1})
            .forEach(item =>  products.push(item))
                .then(() =>{
                    res.status(200).json(products)
                    })
                        .catch(() => {
                            res.status(500).json({error: 'could not fetch the document'})
    })
    })

async function populateCartIds(ids){
    return Promise.all(ids.map(id => db.collection(process.env.MONGO_COLLECTION).findOne({ id })) )
}

app.get('/users/:userId/cart', async (req, res) =>{
    const user = await db.collection('users')
        .findOne({ id: req.params.userId})
    const populatedCart = await populateCartIds(user.cartItems)
        res.json(populatedCart)
})

app.get('/products/:productId',async (req, res) =>{
    const productId = req.params.productId;
    const product = await db.collection(process.env.MONGO_COLLECTION).findOne({ id: productId});
        res.json(product)
})
app.post('/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

        await db.collection('users').updateOne({ id: userId },{
            $addToSet: { cartItems: productId }
    });
    const user = await db.collection('users')
        .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems)
        res.json(populatedCart);
})

app.delete('/users/:userId/cart/:productId',async (req,res) =>{
    const userId = req.params.userId;
    const productId = req.params.productId;

        await db.collection('users').updateOne({ id: userId }, {
            $pull: { cartItems: productId},
    });
    const user = await db.collection('users')
        .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems)
        res.json(populatedCart);
})

