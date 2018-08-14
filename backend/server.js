const express = require("express");
const app = express();

const url = "mongodb://admin:admin123@ds121332.mlab.com:21332/auctionsdb";
const database = "auctionsdb";
const collCategories = "categories";
const collCountries = "countries";
const collItemState = "itemState";
const collOrganizations = "organizations";
const collItems = "items";

let serverState = {
    categoriesList: [],
    countriesList: [],
    itemStateList: []
}

var db = require('./db');

//CONNECTION WITH MONGO DB WHEN APP INIT
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

                res.send(JSON.stringify({ status: true, message: "", 
                                        categories: serverState.categoriesList, 
                                        countries: serverState.countriesList, 
                                        itemState: serverState.itemStateList }));
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
        res.send(JSON.stringify({ status: true, message: "", 
                                categories: serverState.categoriesList, 
                                countries: serverState.countriesList, 
                                itemState: serverState.itemStateList }));
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

