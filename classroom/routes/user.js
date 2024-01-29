
const express = require("express");
const router =express.Router();

//Index
router.get("/",(req,res)=>
{
    res.send("get for users");
})

//show
router.get("/:id",(req,res)=>
{
    res.send("get for show users id")
})

//post
router.post("/",(req,res)=>
{
    res.send("post for users");
})

//delete
router.delete("/:id",(req,res)=>
{
    res.send("delete for users")
})

module.exports = router;