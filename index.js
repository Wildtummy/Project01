const express = require('express');
const users =require('./Mock_DATA.json'); 
const fs= require("fs");
const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({extended:false}));
//Routes


app.get('/users',(req,res)=>{
const html=`
<ul>
${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
</ul> 
`;
res.send(html);
});

app.get('/api/users',(req,res)=>{
    return res.json(users);
})
// dynamic path parameter (: used for variables)
app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const user= users.find((user)=>user.id==id);
   if(!user){return res.status(404).json({error: "user not found"});}
    return res.json(user);
})
.patch((req,res)=>{return res.json({status:"pending"});
})
.delete((req,res)=>{return res.json({status:"pending"});
})
app.post('/api/users',(req,res)=>{
    const body=req.body;
    if(!body || !body.first_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json("Fill all fields!"); 
    }
    users.push({id:users.length+1,...body});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users) ,(err,data)=>{
        return res.status(201).json({status:"Success", id:users.length} );
    });
});
// server will be ready indefinitely on PORT for the incoming request until the server is killed
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

