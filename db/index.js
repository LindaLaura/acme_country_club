const Sequelize = require('sequelize');
const {STRING, DATE, INTEGER, UUID, UUIDV4} = Sequelize;
const conn = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost/acme_country_club_db');


const Facility = conn.define('facility',{
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name:{
        type: STRING(100),
        allowNull: false,
        unique: true
    }
});

const Member = conn.define('member',{
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name:{
        type: STRING(20),
        allowNull: false,
        unique: true
    }
});

const Booking = conn.define('booking',{
    id:{
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startTime:{
        type: DATE,
        allowNull: false
    },
    endTime:{
        type: DATE,
        allowNull: false
    }
});

const Member_Booking = conn.define('member_booking',{
    id:{
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

});


Booking.belongsTo(Member , {as: 'bookedBy'});
Member.hasMany(Booking, { foreignKey: 'bookedById'});

Booking.belongsTo(Facility);
Facility.hasMany(Booking);

Member.belongsTo(Member , {as: 'sponsor'});
Member.hasMany(Member, { foreignKey: 'sponsorId'});

Member_Booking.belongsTo(Member , {as: 'bookedBy'});
Member.hasMany(Member_Booking , {as: 'bookedById'});

Member_Booking.belongsTo(Booking);
Booking.hasMany(Member_Booking);

const syncAndSeed = async() =>{
    await conn.sync({ force : true});
    var [pool, school, library, linda, lucie, moe, mary, startTime, endTime] = await Promise.all([
        Facility.create({name: 'pool'}),
        Facility.create({name: 'school'}),
        Facility.create({name: 'library'}),
        Member.create({name: 'linda'}),
        Member.create({name: 'lucie'}),
        Member.create({name: 'moe'}),
        Member.create({name: 'mary'}),
        Booking.create({startTime: new Date(2019, 1, 24), endTime: new Date(2021, 1, 24)}),
        Booking.create({startTime: new Date(2018, 6, 6), endTime: new Date(2019, 8, 24)}),
        Booking.create({startTime: new Date(2018, 6, 6), endTime: new Date(2019, 8, 24)}),
    ]);
    
    linda.sponsorId = lucie.id;
    mary.sponsorId = linda.id;
    moe.sponsorId = linda.id;
    startTime.facilityId = pool.id; 
    endTime.facilityId = pool.id;
    startTime.bookedById = linda.id; 
    endTime.bookedById= lucie.id;

    await Promise.all([
        linda.save(),
        mary.save(),
        moe.save(),
        startTime.save(),
        endTime.save()
    ]);
};

module.exports = {
    conn,
    syncAndSeed,
    models:{
        Facility,
        Member,
        Booking,
        Member_Booking
    }
}