const {conn, syncAndSeed, models:{Facility, Member, Booking, Member_Booking} } = require('./db')
const Sequelize = require('sequelize');
const {STRING, DATE, INTEGER, UUID, UUIDV4} = Sequelize;

const express = require('express');

const app = express();

app.get('/api/facilities', async(req, res, next) => {
    try{
        res.send(await Facility.findAll({
            include:[
                {
                    model: Booking,
                }
            ]
        }))
    }
    catch(ex){
        next(ex);
    }
});

app.get('/api/bookings', async(req, res, next) => {
    try{
        res.send(await Booking.findAll({
            include:[
                {
                    model: Facility,
                },
                {
                    model: Member,
                    as: 'bookedBy'
                }
            ]
        }))
    }
    catch(ex){
        next(ex);
    }
});

app.get('/api/members', async(req, res, next) => {
    try{
        res.send(await Member.findAll({
            include:[
                {
                    model: Member,  
                    as: 'sponsor'
                },
                {
                    model: Member,
                }

            ]
        }))
    }
    catch(ex){
        next(ex);
    }
});

const init =  async() => {
    try{
        await conn.authenticate();
        await syncAndSeed();
        const port = process.env.PORT || 1337;
        app.listen(port, () => console.log(`Listening on ${port}`));
    }
    catch(ex){
        console.log(ex);
    }
}

init();