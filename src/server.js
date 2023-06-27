import express from "express"
import cors from "cors"
import { connectToDb, getDb } from "./index";
import path from 'path';


require('dotenv').config()



// db connection 
let db
    connectToDb((err) => {
        if(!err){

            app.listen(port, () => {
                console.log('server is listening on port' + port)
                })
    db = getDb()
}
})

const port = process.env.PORT || 8000;

const app = express()
app.use(express.json())
app.use(cors())

app.use('/images', express.static(path.join(__dirname, '../assets')) )


//changes for render
app.use(express.static(
    path.resolve(__dirname, '../dist'),
    { maxAge: '1y', etag: false},
));

app.get('/hello', (req, res) =>{
    });

app.get('/api/products', (req, res) =>{
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

app.get('/api/users/:userId/cart', async (req, res) =>{
    const user = await db.collection('users')
        .findOne({ id: req.params.userId})
    const populatedCart = await populateCartIds(user?.cartItems || [])
        res.json(populatedCart)
})

app.get('/api/products/:productId',async (req, res) =>{
    const productId = req.params.productId;
    const product = await db.collection(process.env.MONGO_COLLECTION).findOne({ id: productId});
        res.json(product)
})
app.post('/api/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection('user').findOne({ id:userId });

    if(!existingUser){
        await db.collection('users').insertOne({ id:userId, cartItems: []})
    }

        await db.collection('users').updateOne({ id: userId },{
            $addToSet: { cartItems: productId }
    });

    const user = await db.collection('users')
        .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user?.cartItems || [])
        res.json(populatedCart);
})

app.delete('/api/users/:userId/cart/:productId',async (req,res) =>{
    const userId = req.params.userId;
    const productId = req.params.productId;

        await db.collection('users').updateOne({ id: userId }, {
            $pull: { cartItems: productId},
    });
    const user = await db.collection('users')
        .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user?.cartItems || [])
        res.json(populatedCart);
})

//render change
app.get('*', (req,res) => {
    res.sendFile(path.join(_dirname, '../dist/index.html'))
});