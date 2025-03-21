import express from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, UserModel } from './db';
import { userMiddleware } from './middleware';

const JWT_Password = "hvfvbrtfgb23"

const app = express()

app.use(express.json());

app.post('/api/v1/signup',async (req,res)=>{
    // zod validation  , hash the password
    const username = req.body.username;
    const password = req.body.password;
    try{
        await  UserModel.create({username , password })
        res.json({message:"user signed up"})
    }catch(e){
        res.status(411).json({
            message:'User already exist'
        })
    }
   
})

app.post('/api/v1/signin',async (req,res)=>{
    
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username
    })

    try{
        if(existingUser){
            const token =  jwt.sign({id:existingUser._id,},JWT_Password);
            return res.json({token})
        }else{
            res.status(403).json({
                message:'Incorrect credentials'
            })
        }
    }catch(e){
        res.status(411).json({
            message:'User already exist'
        })
    }
   
})



app.post('/api/v1/content',userMiddleware,async (req,res)=>{
   const link = req.body.link
   const type = req.body.type

   
   await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId:req.userId,
    tags:[],

   })
})

app.get('/api/v1/content', userMiddleware,async (req,res)=>{

    // @ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId:userId
    }).populate('userId','username')
    res.json({
        content
    })
})


app.delete('/api/v1/content',userMiddleware , async (req,res)=>{   

    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId:contentId,
        // @ts-ignore
        userId:req.userId
    })

  res.json({
    message:'Deleted'
  })

})


app.post('/api/v1/brain/share',(req,res)=>{


})

app.post('/api/v1/brain/:shareLink',(req,res)=>{


})

app.listen(3000)