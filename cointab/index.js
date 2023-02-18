const express = require('express');

const app = express();
require('dotenv').config();
const axios = require('axios')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const Users = require("./models/userSchema");

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DB)

app.get("/", (req, res) => {
    res.render("Home")
})

app.get("/fetch-users", async (req, res) => {
    let search = "";
    if (req.query.search) {
        search = req.query.search
    }

    let page = 1;
    if (req.query.page) {
        page = req.query.page
    }

    let limit = 20;
    const userDetails = await Users.find({
        $or: [
            { email: { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'name.first' : { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'location.country': { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'dob.age': { $regex: '.*' + search + '.*', $options : 'i' } },
            { phone: { $regex: '.*' + search + '.*', $options : 'i' } },
            { gender: { $regex: '.*' + search + '.*', $options : 'i' } },
        ]
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await Users.find({
        $or: [
            { email: { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'name.first' : { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'location.country': { $regex: '.*' + search + '.*', $options : 'i' } },
            { 'dob.age': { $regex: '.*' + search + '.*', $options : 'i' } },
            { phone: { $regex: '.*' + search + '.*', $options : 'i' } },
            { gender: { $regex: '.*' + search + '.*', $options : 'i' } },
          ]
    }).countDocuments();
    res.render("user-details", { data: userDetails, totalPages : Math.ceil(count/limit), cureentPage : page })


})

app.get("/delete-user", async (req, res) => {
    await Users.deleteMany();
    res.send("User delete SuccessFully")
})

app.get("/api/fetch-users", async (req, res) => {
    await axios.get(process.env.API_KEY)
        .then((res) => {
            const data = res.data.results;
            data.map(element => (
                Users.create({
                    name: element.name,
                    gender: element.gender,
                    location: element.location,
                    email: element.email,
                    login: element.login,
                    dob: element.dob,
                    registered: element.registered,
                    phone: element.phone,
                    cell: element.cell,
                    id: element.id,
                    picture: element.picture
                })
            ))
        })
    res.send("Successfully data insert into db")
})



app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on port ${process.env.PORT}`)
})