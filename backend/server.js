const express = require("express");
const bodyParser = require("body-parser");
const sha256 = require('sha256');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
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
const collBuyers = "buyers";
const collBidTran = "bidTransactions";

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
io.on('connection', function (socket) {
    socket.on('sendMessage', function (content) {
        socket.join(content.room);
        io.sockets.in(content.room).emit('receiveMessage', content);
    });
    socket.on('sendLastPrice', function (content) {
        socket.join(content.room);
        let lastPri = getItemLastPrice(content.itemId);
        io.sockets.in(content.room).emit('receiveLastPrice', { itemId: content.itemId, lastPrice: lastPri });
    });
});


http.listen(5000, function () {
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
 * Endpoint to do sign Up for orgs and buyers
 */
app.post("/signUp", (req, res) => {

    let datab = getDatabase();
    var collOrg = datab.collection(collOrganizations);
    var collBuy = datab.collection(collBuyers);

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

    } else if (bodyParam.userType !== undefined && bodyParam.userType === USER_TYPE_BUYER) {

        collBuy.find({ username: bodyParam.username }).toArray(function (err, result) {
            if (err) { throw err; }

            if (result.length > 0) {
                res.send(JSON.stringify({ status: false, message: "error in account creation, username alrready used" }))
            } else {
                //delete userType attribute
                delete bodyParam['userType'];
                //send to db to insert
                //bodyParam.orgId = Math.floor(Math.random() * 1000) + "";
                bodyParam.userId = '';
                bodyParam.password = sha256(bodyParam.password);

                collBuy.insertOne(bodyParam, function (err, result) {
                    if (err) {
                        res.send(JSON.stringify({ status: false, message: "error in account creation" }));
                        throw err;
                    }

                    let id = result.ops[0]._id.toString();
                    var myquery = result.ops[0];
                    var newvalues = { $set: { userId: id } };
                    //if insertion was ok, read and update to set user id.
                    collBuy.updateOne(myquery, newvalues, function (err, result) {
                        if (err) { throw err };
                        res.send(JSON.stringify({ status: true, message: "successfully created account" }));
                    });

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
    var collBuy = datab.collection(collBuyers);

    let token = Math.floor(Math.random() * 100000000000) + "";

    collOrg.find({ username: bodyParam.username, password: sha256(bodyParam.password) }).toArray(function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {

            //save session in bd
            let objSess = { username: bodyParam.username, userType: "org", usrId: result[0].orgId, token: token, active: true, date: new Date().toISOString() };
            collSess.insertOne(objSess, function (err, result) {
                if (err) { throw err; }
            });

            //set cookie and send response
            res.cookie(COOKIE_NAME, token);
            res.send(JSON.stringify({ status: true, message: "", userType: "org", orgId: result[0].orgId }))

        } else {

            collBuy.find({ username: bodyParam.username, password: sha256(bodyParam.password) }).toArray(function (err, result) {
                if (err) { throw err; }
                if (result.length > 0) {

                    //save session in bd
                    let objSess = { username: bodyParam.username, userType: "buyer", usrId: result[0].userId, token: token, active: true, date: new Date().toISOString() };
                    collSess.insertOne(objSess, function (err, result) {
                        if (err) { throw err; }
                    });

                    //set cookie and send response
                    res.cookie(COOKIE_NAME, token);
                    //res.send(JSON.stringify({ status: true, message: "", userType: "buyer", userId: result[0].userId }))
                    let objUser = result[0];
                    delete objUser['password'];
                    res.send(JSON.stringify({ status: true, message: "", userType: "buyer", user: objUser }))
                } else {
                    res.send(JSON.stringify({ status: false, message: "invalid username or password" }))
                }
            });
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

app.get('/home', (req, res) => {
    let currentSession = getSessionIdFromCookie(req);

    let datab = getDatabase();
    var collSess = datab.collection(collSessions);
    var collBuy = datab.collection(collBuyers);

    let query = { token: currentSession, active: true };

    collSess.find(query).toArray(function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {

            let userTypeSaved = result[0].userType;
            if (userTypeSaved === USER_TYPE_BUYER) {
                //res.send(JSON.stringify({ status: true, message: "user has an active session", username: result[0].username, userType: userTypeSaved, userId: result[0].usrId }))
                collBuy.find({ userId: result[0].usrId }).toArray(function (err, result) {
                    if (err) { throw err; }
                    if (result.length > 0) {
                        let objUser = result[0];
                        delete objUser['password'];
                        res.send(JSON.stringify({ status: true, message: "user has an active session", user: objUser }))
                    }
                });

            } else { //if it is a org
                res.send(JSON.stringify({ status: true, message: "user has an active session", username: result[0].username, userType: userTypeSaved, orgId: result[0].usrId }))
            }

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

app.post("/bidItem", (req, res) => {
    let datab = getDatabase();
    let collBid = datab.collection(collBidTran);
    let collItm = datab.collection(collItems);

    bodyParam = JSON.parse(req.body.toString());
    bodyParam.date = new Date().toISOString();

    //check if user session exist
    let collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            //verify if item exist and available to auction
            collItm.find({ itemId: bodyParam.itemId, state: "TO_AUCTION" }).toArray(function (err, result) {
                if (err) { throw err }

                else if (result.length > 0) {
                    collBid.insertOne(bodyParam, function (err, result) {
                        if (err) {
                            res.send(JSON.stringify({ status: false, message: "error processing bid to item" }))
                            throw err;
                        }
                        let id = result.ops[0]._id.toString();
                        var myquery = result.ops[0];
                        var newvalues = { $set: { transactionId: id } };
                        //if insertion was ok, read and update to set transaction id.
                        collBid.updateOne(myquery, newvalues, function (err, result) {
                            if (err) { throw err }

                            else if (result.result.nModified > 0) {
                                //update last price of the item
                                collItm.updateOne({ itemId: bodyParam.itemId }, { $set: { lastPrice: bodyParam.bid } }, function (err, result) {
                                    if (err) { throw err; }
                                    else if (result.result.nModified > 0) {
                                        res.send(JSON.stringify({ status: true, message: "transaction success", transactionId: id }));
                                    }
                                });
                            }
                        });
                    });

                } else {
                    res.send(JSON.stringify({ status: false, message: "item not found, offer can not be processed" }));
                }
            });

        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }));
        }
    });


});

/**
 * Endpoint to close item 
 */
app.post("/closeItem", (req, res) => {

    let datab = getDatabase();
    let collItem = datab.collection(collItems);
    let collBid = datab.collection(collBidTran);
    let collBuy = datab.collection(collBuyers);
    let bodyParam = JSON.parse(req.body.toString());

    //check if user session exist
    let collSess = datab.collection(collSessions);
    let currentSession = getSessionIdFromCookie(req);

    let querySess = { username: bodyParam.username, token: currentSession, active: true };

    collSess.find(querySess).toArray(function (err, result) {
        if (err) { throw err; }
        else if (result.length > 0) {

            let myquery = { itemId: bodyParam.itemId };

            //search if there is a winner
            collBid.find({ itemId: bodyParam.itemId }).sort({ bid: 1 }).toArray(function (err, result) {
                if (err) { throw err; }
                if (result.length > 0) {

                    //update Item  
                    let userWinner = result[0].userId;
                    let bidPrice = result[0].bid;
                    let newvalues = { $set: { bidClosedDate: new Date().toISOString(), state: ITEM_STATE_AUCTIONED, lastPrice: result[0].bid, winnerUserId: userWinner } };
                    collItem.updateOne(myquery, newvalues, function (err, result) {
                        if (err) {
                            throw err;
                        } else if (result.result.nModified > 0) {

                            //find info user winner
                            collBuy.find({ userId: userWinner }).toArray(function (err, result) {
                                if (err) { throw err; }
                                if (result.length > 0) {
                                    res.send(JSON.stringify({
                                        status: true, message: "",
                                        winner: { userId: userWinner, username: result[0].username, firstname: result[0].firstname, lastname: result[0].lastname, biddedPrice: bidPrice, email: result[0].email }
                                    }));
                                }
                            });

                        } else {
                            res.send(JSON.stringify({ status: false, message: "error trying to close the item" }));
                        }
                    });
                } else {
                    //if no winner,update Item                                     
                    let newvalues = { $set: { bidClosedDate: new Date().toISOString(), state: ITEM_STATE_AUCTIONED } };
                    collItem.updateOne(myquery, newvalues, function (err, result) {
                        if (err) {
                            throw err;
                        } else if (result.result.nModified > 0) {
                            res.send(JSON.stringify({ status: true, message: "", winner: {} }));
                        } else {
                            res.send(JSON.stringify({ status: false, message: "error trying to close the item" }));
                        }
                    });
                }
            });


        } else {
            res.send(JSON.stringify({ status: false, message: "user does not have any active session" }))
        }

    });
});

app.post("/sendEmail", (req, res) => {
    let bodyParam = JSON.parse(req.body.toString());

    let adminEmail = "charitybidadm@gmail.com";
    let adminEmailPass = "decode123!";

    var mailOptionsUser = {
        from: adminEmail,
        to: bodyParam.userEmail,
        subject: bodyParam.userEmailSubject,
        text: bodyParam.userEmailText
    };

    var mailOptionsOrg = {
        from: adminEmail,
        to: bodyParam.orgEmail,
        subject: bodyParam.orgEmailSubject,
        text: bodyParam.orgEmailText
    };

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: adminEmail,
            pass: adminEmailPass
        }
    });

    //send email to org
    //TODO: catch all errors and send in the reponse
    transporter.sendMail(mailOptionsOrg, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            //send email to user
            transporter.sendMail(mailOptionsUser, function (error, info) {
                if (error) {
                    res.send(JSON.stringify({ status: false, message: "error sending emails" }));
                    console.log(error);
                } else {
                    res.send(JSON.stringify({ status: true, message: "" }));
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
});

function getSessionIdFromCookie(req) {
    let sessionID = req.headers.cookie != undefined ? req.headers.cookie.split("=")[1] : "";
    return sessionID;
}

function getItemLastPrice(itemIdParam) {
    let lastPrice = 0;
    /*let cb = () => {
        return lastPrice;
    };*/

    let datab = getDatabase();
    let collItm = datab.collection(collItems);

    collItm.find({ itemId: itemIdParam }).toArray(function (err, result) {
        if (err) { throw err }
        else if (result.length > 0) {
            lastPrice = result[0].lastPrice;
            //cb();
            return lastPrice;
        }
    });
    return lastPrice;
}

function sendMail(mailOptions) {

    let cb = (status) => {
        return status;
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'linque26@gmail.com',
            pass: 'lq150885'
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            //return false;
            cb(false);
        } else {
            console.log('Email sent: ' + info.response);
            //return true;
            cb(true);
        }
    });
}