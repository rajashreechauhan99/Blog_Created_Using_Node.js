const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const adminLayout = '../views/layouts/admin';
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('./admin');
const jwtSecret = process.env.JWT_SECRET;
/*
JSON Web Tokens (JWTs) are used to securely transmit 
information between two parties, such as a client and
a server. They are commonly used for authentication 
and authorization.
 * 
 */

/*
    Check Login
*/

const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;//requesting cookies from browser

    if(!token){
        return res.status(401).json({message:'unauthorized'});
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId =decoded.userId;
        next();
    }
    catch(error){
        res.status(401).json({message:'unauthorized'});
    }
}



/*
    GET
    Admin-Login Page
*/

router.get('/admin', async(req,res) => {
     try{
        const locals ={
            title:"Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index',{
            locals,
            layout:adminLayout
        });
     }
     catch(error){
        console.log(error);
     }
})

/*
    POST
    Admin - Check Login
*/

router.post('/admin', async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message:'Invalid credentials'})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const token =  jwt.sign({userId: user._id},jwtSecret);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
});


/**
 * POST
 * Admin/Dashboard
 */

router.get('/dashboard',authMiddleware,async (req,res) =>{


    try{

        const locals={
            title:"Dashboard",
            description:"Simple Blog created with NodeJS, Express & MongoDB"
        }


        const data = await Post.find();//finding everything
        res.render('admin/dashboard',{
            locals,
            data,
            layout:adminLayout
        });
        
    }
    catch(error){
        console.log(error);
    }

    
})

/**
 * POST 
 * Admin 
 */

router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

/**
 * GET
 * Admin-create new post
 */

router.post('/add-post', async(req,res)=>{

    try{
        
        try{
             const newPost = new Post({
                title: req.body.title,
                body:req.body.body
             });

             await Post.create(newPost);
             res.redirect('/dashboard')
        }
        catch(error){
            console.log(error);

        }



    }
    catch(error){
        console.log(error)
    }

});

router.get('/edit-post/:id',async(req,res)=>{
    try{
        const locals = {
            title:"Edit Post",
            description:"Simple Blog created with NodeJS Express & MongoDB"
        }
        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{
            locals,
            data,
            layout:adminLayout
        });
    }catch(error){
        console.log(error);
    }
});

router.put('/edit-post/:id',async(req,res)=>{
    try{
        
        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt:Date.now()
        });
        res.redirect('/edit-post/${req.params.id}');
    }catch(error){
        console.log(error);
    }
});


/**
 * DELETE
 * Admin-Delete post
 */

router.delete('/delete-post/:id',async(req,res)=>{
    try{
        await Post.deleteOne({ _id:req.params.id});
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error)
    }
})

// router.post('/admin', async (req,res)=>{
//     try{
//         const {username,password} = req.body;
//         // console.log(req.body);

//         if(req.body.username === 'rajashreechauhan' && req.body.password === '12563'){
//             res.send("You Are Logged In")
//         }
//         else{
//             res.send('Wrong username password')
//         }


//         res.redirect('/admin');
//     }
//     catch(error){
//         console.log(error);
//     }
// });


/**
 * POST
 * Admin-register
 */

router.post('/register',async (req,res)=>{

    try{
        const{username,password} =req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user =await User.create({username,password:hashedPassword});
            res.status(201).json({message:'User Created',user});
        }catch(error){
            if(error.code === 11000){
                res.status(409).json({message:'user already exists'});
            }
            res.status(500).json({message:'Internal Server Error'});
        }
    }
    catch(error){
        console.log(error);
    }



});

router.get('/logout',(req,res)=>{

    res.clearCookie('token');
    // res.json({message:"Logout Successfully!!!"})
    res.redirect('/');
})



module.exports = router;