const express=require('express');
const morgan=require('morgan');//indirectly calls 'next' function
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:"It Works!"
//     });//stringify json to send over the web 
// });//middleware to get response

mongoose.connect('mongodb+srv://adilotha:'+process.env.MONGO_PSW+'@node-rest-shop-yxg2l.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log('DB Connected'))
.catch((err)=>console.log(err));
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With,Content-Type, Accept, Authorization"
//     );
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE');
//         return res.status(200).json({});
//     }
// });
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use('/uploads',express.static('uploads'));
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            msg: error.message
        }
    })
})

module.exports=app;