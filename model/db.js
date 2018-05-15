var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var assert = require('assert');

const db_url = 'mongodb://localhost:27017'
const db_name = 'IntegerDB';

async function addUser(email, password, cb) {

    let client;

    try {

        client = await MongoClient.connect(db_url);
        const db = client.db(db_name)
    
        //check if it already exists
        let response = await db.collection('users').findOne({email:email});

        if(response) {
            cb(false, 'User already exists');
            return;
        }

        response = await db.collection('users').insertOne({
            email: email,
            password: password,
            number: 0
        });

        //make sure it got inserted
        assert.equal(1, response.insertedCount);
        client.close();

        console.log(response.ops[0]);

        let data = {
            email: response.ops[0].email, 
            number: response.ops[0].number,
            id: response.ops[0]._id
        }
        cb(true, data);

    } catch (err) {
        console.log(err.stack);
        cb(false, 'database error');
        client && client.close();
    }
}

async function getUser(email, password, cb) {

    let client 

    try {

        client = await MongoClient.connect(db_url);
        const db = client.db(db_name);

        let response = await db.collection('users').findOne({email:email});

        if(response) {
            if(response.password === password) {
                cb(true, {email: response.email, number: response.number, id: response._id});
            } else {
                cb(false, 'incorrect password');
            }
        }
        else {
            cb(false, 'User does not exists');
        }
        client.close();
    } catch(err) {
        console.log(err);
        cb(false, 'database error');
        client && client.close();
    }
}

async function getNumber(id, cb) {
    let client; 

    try {
        
        client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        var o_id = new mongo.ObjectID(id);

        let response = await db.collection('users').findOne({_id: o_id});

        if(response){
            cb(true, response.number);
        } else {
            cb(false);
        }
        client.close();

    } catch(err) {
        console.log(err.stack);
        cb(false, 'databse error');
        client && client.close();
    }
}

async function getNumberWithIncrement(id, cb) {
    let client;

    try {
        client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        var o_id = new mongo.ObjectID(id);


        let response = await db.collection('users')
                        .findAndModify(
                            {_id: o_id},
                            [],
                            {$inc: {number: 1}},
                            {new: true});

        if(response) {
            cb(true, response.value.number);
        } else {
            cb(false)
        }
        client.close();
    }catch(err) {
        console.log(err.stack);
        cb(false, 'database error');
        client && client.close();
    }
}

async function setNumber(id, value, cb) {

    let client;

    try {
        client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        var o_id = new mongo.ObjectID(id);

        
        let response = await db.collection('users')
                        .findAndModify(
                            {_id: o_id},
                            [],
                            {$set : {number: value}},
                            {new: true});

        if(response) {
            cb(true, response.value.number);
        } else {
            cb(false)
        }
        client.close();
    }catch(err) {
        console.log(err.stack);
        cb(false, 'database error');
        client && client.close();
    }
}

module.exports = {
    addUser, getUser, getNumber, getNumberWithIncrement, setNumber
}

