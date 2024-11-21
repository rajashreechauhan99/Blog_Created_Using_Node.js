const express = require('express');
const router = express.Router();
const Post =require('../models/Post');



//Routes
router.get('',async(req,res)=>{
    // const locals= {
    //     title: "NodeJS Blog",
    //     description: "Simple Blog created with NodeJS,Express & MongoDB",
    // }

    try{

        const locals= {
            title: "NodeJS Blog",
            description: "Simple Blog created with NodeJS,Express & MongoDB",
        }
        // const data = await Post.find();
        let perPage =6
        let page =req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt:-1}}]).skip(perPage*page-perPage).limit(perPage).exec();

        const count = await Post.countDocuments({});
        const nextPage =parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/ perPage)
        res.render('index',{
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage :null,
            currentRoute:'/'
        });
    }
    catch(error){
        console.log(error);
    }

    // res.render('index',{locals});//rendering the whole index page
});

router.get('/post/:id',async(req,res)=>{
    try{

        let slug = req.params.id;

        const data = await Post.findById({_id:slug});


        const locals ={
            title:data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        }
        res.render('post',{
            locals,
            data,
            currentRoute:`/post/${slug}`
        });
    }
    catch(error){
        console.log(error)
    }
    
})


/*
    POST
    POST SEARCHTERM
*/

router.post('/search',async(req,res)=>{
   try{
    const locals = {
        title: "Search",
        description: "Simple Blog created with NodeJS,Express & MongoDB."
    }

    let searchTerm = req.body.searchTerm;

    console.log(searchTerm);
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")

    const data = await Post.find({
        $or:[
            {title: {$regex:new RegExp(searchNoSpecialChar,'i')}},
            {body:{$regex:new RegExp(searchNoSpecialChar,'i')}},
        ]
    })

    res.render("search",{
        data,
        locals
    })

   }
   catch(error){
    console.log(error);
   }
});




// function insertPostData () {
//     Post.insertMany([
//         {
//             title:"Building a Blog",
//             body:"This is the body text"
//         },
//         { 
//             title: "Introduction to JSON", 
//             body: "JSON stands for JavaScript Object Notation." 
//         },
//         { 
//             title: "What is an API?", 
//             body: "An API allows applications to communicate with each other." 
//         },
//         { 
//             title: "Basics of HTTP", 
//             body: "HTTP is the foundation of any data exchange on the Web." 
//         },
//         { 
//             title: "What is REST?", 
//             body: "REST is an architectural style for APIs." 
//         },
//         { 
//             title: "Understanding CRUD", 
//             body: "CRUD stands for Create, Read, Update, Delete." 
//         },
//         { 
//             title: "JavaScript ES6 Features", 
//             body: "ES6 introduced new features like let, const, and arrow functions." 
//         },
//         { 
//             title: "What is Node.js?", 
//             body: "Node.js is a JavaScript runtime built on Chrome's V8 engine." 
//         },
//         { 
//             title: "Introduction to React", 
//             body: "React is a JavaScript library for building user interfaces." 
//         },
//         { 
//             title: "What is Git?", 
//             body: "Git is a version control system for tracking changes in code." 
//         },
//         { 
//             title: "Basics of CSS Flexbox", 
//             body: "Flexbox makes it easy to align elements on a page." 
//         },
//         { 
//             title: "What is a Database?", 
//             body: "A database stores structured data for easy access." 
//         },
//         { 
//             title: "Understanding SQL", 
//             body: "SQL is a language for querying relational databases." 
//         },
//         { 
//             title: "What is NoSQL?", 
//             body: "NoSQL databases are non-relational and schema-less." 
//         },
//         { 
//             title: "Introduction to Python", 
//             body: "Python is a high-level programming language." 
//         },
//         { 
//             title: "What is Machine Learning?", 
//             body: "Machine Learning allows systems to learn from data." 
//         },
//         { 
//             title: "Basics of Docker", 
//             body: "Docker is a tool to create, deploy, and run containers." 
//         },
//         { 
//             title: "What is Kubernetes?", 
//             body: "Kubernetes is a system for managing containerized applications." 
//         },
//         { 
//             title: "What is Cloud Computing?", 
//             body: "Cloud computing provides on-demand computing services." 
//         },
//         { 
//             title: "Basics of Blockchain", 
//             body: "Blockchain is a decentralized digital ledger." 
//         },
//         { 
//             title: "What is DevOps?", 
//             body: "DevOps is a set of practices to automate and integrate software development." 
//         },
// ]);
// }

// insertPostData();





router.get('/about',(req,res)=>{
   res.render('about',{
            currentRoute:'/about'
   });//rendering the whole about page
});

module.exports = router;