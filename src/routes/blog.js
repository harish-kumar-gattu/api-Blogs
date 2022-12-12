const router = require('express').Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blog')

// Your routing code goes here


router.get('/blog', async (req, res) => {
    try {
        // node --v 18 require IP address instead of  "localhost" string so used
        await mongoose.connect("mongodb://127.0.0.1/Blog");
        const page = req.query.page;
        const docLimit = 5;
        const topic = req.query.search;
        let length = Object.keys(req.query).length
        if (length) {

            const blog = await Blog
                .find({ topic: topic })
                .skip((page - 1) * docLimit)
                .limit(docLimit);
            console.log(blog);
            if (blog.length !== 0) {
                res.json({
                    status: "SUCCESS",
                    data: blog
                })
            } else {
                res.status(404).json({
                    status: "Failed",
                    message: 'Not Found'
                })
            }
        } else {
            const data = await Blog.find();
            console.log(data);
            if (data.length !== 0) {
                res.json({
                    status: "SUCCESS",
                    data: data
                })
            } else {
                res.status(404).json({
                    status: "Failed",
                    message: "data not found"
                })
            }
        }

    } catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }

})

router.get("/blog", (req, res) => {
    res.json({
        status: "Ok"
    })
})


router.post("/blog", async (req, res) => {
    try {
        await mongoose.connect("mongodb://127.0.0.1/Blog");
        const blog = await Blog.create(req.body);
        res.json({
            status: "SUCCESS",
            data: blog
        })
    } catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }

})


router.put('/blog/:id', async (req, res) => {
    // await mongoose.connect("mongodb://127.0.0.1/Blog");
    try {
        const blog = await Blog.updateOne({ _id: req.params.id }, req.body)
        if (blog.nModified) {
            res.json({
                status: "SUCCESS",
                data: blog
            })
        } else {
            res.status(400).json({
                status: "Failed",
                message: "Bad Request"
            })
        }
    } catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }
})


router.delete("/blog/:id", async (req, res) => {
    try {
        await mongoose.connect("mongodb://127.0.0.1/Blog");
        const blog = await Blog.deleteOne({ _id: req.params.id });

        if (blog.deletedCount) {
            res.json({
                status: "SUCCESS",
                data: blog
            })
        } else {
            res.status(404).json({
                status: "Failed",
                message: "Data not Found"
            })
        }
    } catch (e) {
        res.status(404).json({
            status: "Failed",
            message: e.message
        })
    }
})



module.exports = router;