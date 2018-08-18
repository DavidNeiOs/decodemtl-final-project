const express = require("express");
const bodyParser = require("body-parser");
const sha256 = require('sha256');
const app = express();
const cors = require('cors');
var db = require('./db');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.raw({ type: "*/*" }));

//BUSINESS CONSTANTS-------------------------------------------------
const url = "mongodb://admin:admin123@ds121332.mlab.com:21332/auctionsdb";
const database = "auctionsdb";
const collCategories = "categories";
const collCountries = "countries";
const collItemState = "itemState";
const collOrganizations = "organizations";
const collItems = "items";
const collSessions = "sessions";

const USER_TYPE_BUYER = "buyer";
const USER_TYPE_ORG = "org";
const COOKIE_NAME = "sessionID";

const ITEM_STATE_TO_AUCTION = "TO_AUCTION";
const ITEM_STATE_AUCTIONED = "AUCTIONED";
const ITEM_STATE_CANCELED = "CANCELED";

let serverState = {
    categoriesList: [],
    countriesList: [],
    itemStateList: []
}

//CHAT SOCKET IO--------------------------------------------------------
//io.origins([allowedOrigins]);
/*io.on('connection', socket => {
    console.log("connected !");
})*/
io.on('connection', function(socket){
    socket.on('sendMessage', function(content) {
        socket.join(content.room);
        io.sockets.in(content.room).emit('receiveMessage', content);
    });
});


http.listen(5000, function(){
    console.log('chat listening on *:' + 5000);
});

//CONNECTION WITH MONGO DB WHEN APP INIT---------------------------------
db.connect(url, function (err) {
    if (err) {
        console.log('Unable to connect to MongoDb.')
        process.exit(1);
    } else {
        app.listen(4000, () => {
            console.log("AUCTION backend project listening on port 4000");
        });
    }
})



function getDatabase() {
    return db.get().db(database);
}

/**
 * Endpoint that return the initial info used as parameters of the website, like
 * categories, countries, itemStates.
 * This data usually is static and doesn't change, for this reason, it is saved in the 
 * server state variable. This info is reloaded from database if the server is
 * restarted.
 */
app.get("/getParams", (req, res) => {

    if (!(serverState.categoriesList.length > 0
        && serverState.countriesList.length > 0
        && serverState.itemStateList.length > 0)) {

        let cb = () => {
            //set response
            if (serverState.categoriesList.length > 0
                && serverState.countriesList.length > 0
                && serverState.itemStateList.length > 0) {

                res.send(JSON.stringify({
                    status: true, message: "",
                    categories: serverState.categoriesList,
                    countries: serverState.countriesList,
                    itemState: serverState.itemStateList
                }));
            }
        };

        let datab = getDatabase();

        //get categories 
        var collCat = datab.collection(collCategories);
        collCat.find({}).toArray(function (err, result) {
            if (err) throw err;
            serverState.categoriesList = result;
            cb();
        });

        //get countries
        var collCo = datab.collection(collCountries);
        collCo.find({}).toArray(function (err, result) {
            if (err) throw err;
            serverState.countriesList = result;
            cb();
        });

        //get itemStates
        var collItemStates = datab.collection(collItemState);
        collItemStates.find({}).toArray(function (err, result) {
            if (err) throw err;
            serverState.itemStateList = result;
            cb();
        });

    } else {
        res.send(JSON.stringify({
            status: true, message: "",
            categories: serverState.categoriesList,
            countries: serverState.countriesList,
            itemState: serverState.itemStateList
        }));
    }

});

/**
 * Endpoint that return the oraganizations registered
 */
app.get("/getOrgs", (req, res) => {

    let datab = getDatabase();

    //get organizations 
    var collOrg = datab.collection(collOrganizations);
    collOrg.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({ status: true, message: "", orgs: result }));
    });
});

/**
 * Endpoint that return the listing (items) 
 */
app.get("/getItems", (req, res) => {

    let datab = getDatabase();

    //get items
    var collListing = datab.collection(collItems);
    collListing.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({ status: true, message: "", items: result }));
    });
});

/**
 * Endpoint that return the listing (items) 
 */
app.get("/getItem", (req, res) => {

    let itemIdParam = req.query.itemId;

    let datab = getDatabase();
    let collItm = datab.collection(collItems);

    //get item
    collItm.find({ itemId: itemIdParam }).toArray(function (err, result) {
        if (err) { throw err }
        else if (result.length > 0) {
            res.send(JSON.stringify({ status: true, message: "", item: result }));
        } else {
            res.send(JSON.stringify({ status: false, message: "item not found", item: result }));
        }
    });
});


/**
 * Endpoint to do sign Up 
 */
app.post("/signUp", (req, res) => {

    let datab = getDatabase();
    var collOrg = datab.collection(collOrganizations);

    bodyParam = JSON.parse(req.body.toString());

    if (bodyParam.userType !== undefined && bodyParam.userType === USER_TYPE_ORG) {

        //check if there is a account with the same username
        collOrg.find({ website: bodyParam.website }).toArray(function (err, result) {
            if (err) { throw err; }

            if (result.length > 0) {
                res.send(JSON.stringify({ status: false, message: "error in account creation, website alrready registered" }))
            } else {
                collOrg.find({ username: bodyParam.username }).toArray(function (err, result) {
                    if (err) { throw err; }

                    if (result.length > 0) {
                        res.send(JSON.stringify({ status: false, message: "error in account creation, username alrready used" }))
                    } else {
                        //delete userType attribute
                        delete bodyParam['userType'];
                        //send to db to insert
                        bodyParam.orgId = Math.floor(Math.random() * 1000) + "";
                        bodyParam.password = sha256(bodyParam.password);

                        collOrg.insertOne(bodyParam, function (err, result) {
                            if (err) {
                                res.send(JSON.stringify({ status: false, message: "error in account creation" }))
                                throw err;
                            }
                            res.send(JSON.stringify({ status: true, message: "successfully created account" }))
                        });
                    }
                });
            }
        });
    }
});

/**
 * Endpoint to do log In 
 */
app.post('/login', (req, res) => {
    let bodyParam = JSON.parse(req.body.toString());

    //search if user exist in orgs
    let datab = getDatabase();
    var collOrg = datab.collection(collOrganizations);
    var collSess = datab.collection(collSessions);

    collOrg.find({ username: bodyParam.username, password: sha256(bodyParam.password) }).toArray(function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {
            let token = Math.floor(Math.random() * 100000000000) + "";

            //save session in bd
            let objSess = { username: bodyParam.username, token: token, active: true };
            collSess.insertOne(objSess, function (err, result) {
                if (err) { throw err; }
            });

            //set cookie and send response
            res.cookie(COOKIE_NAME, token);
            res.send(JSON.stringify({ status: true, message: "", userType: "org", orgId: result[0].orgId }))
        } else {
            //TODO: search in user collection when login buyer for user login story
            res.send(JSON.stringify({ status: false, message: "invalid username or password" }))
        }

    });
});

app.post('/logout', (req, res) => {
    let bodyParam = JSON.parse(req.body.toString());
    let currentSession = getSessionIdFromCookie(req);

    let datab = getDatabase();
    var collSess = datab.collection(collSessions);
    let query = { username: bodyParam.username, token: currentSession, active: true };
    let newValues = { $set: { username: bodyParam.username, token: currentSession, active: false } };

    collSess.find(query).toArray(function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {
            collSess.updateOne(query, newValues, function (err, result) {
                if (err) throw err;
                res.clearCookie(COOKIE_NAME);
                res.send(JSON.stringify({ status: true, message: "" }))
            });
        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});


/**
 * Endpoint to create item 
 */
app.post("/addItem", (req, res) => {

    let datab = getDatabase();
    var collItem = datab.collection(collItems);
    let bodyParam = JSON.parse(req.body.toString());

    var collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            //if session exist and is active create item
            bodyParam.itemId = "";
            bodyParam.lastPrice = bodyParam.initialPrice;
            bodyParam.creationDate = new Date().toISOString();
            bodyParam.bidCancelDate = "";
            bodyParam.bidClosedDate = "";
            bodyParam.state = ITEM_STATE_TO_AUCTION;
            bodyParam.winnerUserId = "";

            collItem.insertOne(bodyParam, function (err, result) {
                if (err) throw err;

                let id = result.ops[0]._id.toString();
                var myquery = result.ops[0];
                var newvalues = { $set: { itemId: id } };
                //if insertion was ok, read and update item.
                collItem.updateOne(myquery, newvalues, function (err, result) {
                    if (err) throw err;
                    res.send(JSON.stringify({ status: true, message: "", itemId: id }));
                });

            });

        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});


/**
 * Endpoint to create item 
 */
app.put("/updateItem", (req, res) => {

    let datab = getDatabase();
    var collItem = datab.collection(collItems);
    let bodyParam = JSON.parse(req.body.toString());

    //check if user 
    var collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            //if session exist and is active create item
            var myquery = { itemId: bodyParam.itemId };
            bodyParam.updateDate = new Date().toISOString();
            var newvalues = { $set: bodyParam };
            //update Item
            collItem.updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
                res.send(JSON.stringify({ status: true, message: "" }));
            });

        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});

/**
 * Endpoint to cancel item 
 */
app.post("/cancelItem", (req, res) => {

    let datab = getDatabase();
    var collItem = datab.collection(collItems);
    let bodyParam = JSON.parse(req.body.toString());

    //check if user session exist
    var collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            //if session exist and is active create item
            var myquery = { itemId: bodyParam.itemId };
            var newvalues = { $set: { bidCancelDate: new Date().toISOString(), state: ITEM_STATE_CANCELED } };
            //update Item
            collItem.updateOne(myquery, newvalues, function (err, result) {
                if (err) {
                    throw err;
                } else if (result.result.nModified > 0) {
                    res.send(JSON.stringify({ status: true, message: "" }));
                } else {
                    res.send(JSON.stringify({ status: false, message: "error trying to cancel the item" }));
                }
            });

        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});


/**
 * Endpoint to cancel item 
 */
app.post("/closeItem", (req, res) => {

    let datab = getDatabase();
    var collItem = datab.collection(collItems);
    let bodyParam = JSON.parse(req.body.toString());

    //check if user session exist
    var collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            //if session exist and is active create item
            var myquery = { itemId: bodyParam.itemId };
            var newvalues = { $set: { bidCancelDate: new Date().toISOString(), state: ITEM_STATE_AUCTIONED } };
            //update Item
            collItem.updateOne(myquery, newvalues, function (err, result) {
                if (err) {
                    throw err;
                } else if (result.result.nModified > 0) {
                    res.send(JSON.stringify({ status: true, message: "" }));
                } else {
                    res.send(JSON.stringify({ status: false, message: "error trying to cancel the item" }));
                }
            });

        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});

function getSessionIdFromCookie(req) {
    let sessionID = req.headers.cookie != undefined ? req.headers.cookie.split("=")[1] : "";
    return sessionID;
}

