//Regular Part 2 Function
async function findQuery(sqlQuery, client, res) {
    console.log('Inside findQuery');
    console.log('sqlQuery is: ' + sqlQuery);

    await client.connect();

    var dbo = client.db("Stock");
    var coll= dbo.collection("PublicCompanies");

    await coll.find(sqlQuery).toArray(function(err, items) {
        if (err) {
            console.log("Error: " + err);
        } 
        else {
            console.log("Items: ");
            //          !!!THIS console.log() was res.send() before!!!
            //console.log('Passed first res.send()');   !!!!!res.send() IS GIVING ERROR!!!!!
            var tableOutput = '<table border="1">'
                            + '<tr>'
                                + '<th>Company Name</th>'
                                + '<th>Stock Ticker</th>'
                                + '<th>Stock Price</th>'
                            + '</tr>';
            for (i=0; i<items.length; i++) {
                console.log("<Company " + (i + 1) + ": " + items[i].company + "> <Ticker:" + items[i].ticker + "> <Price:" + items[i].Price + ">");			
                tableOutput +=  '<tr>'
                                    + '<td>' + items[i].company + '</td>'
                                    + '<td>' + items[i].ticker + '</td>'
                                    + '<td>' + items[i].Price + '</td>'
                                + '</tr>';
            }
        }  
        tableOutput += '</table>';
        tableOutput += '<a href=/>Try Another Search</a>';
         res.send(tableOutput);
    })
}

//API Function
async function retrievePrice(sqlQuery, client, res) {
    console.log('Inside findQuery');
    console.log('sqlQuery is: ' + sqlQuery);

    await client.connect();

    var dbo = client.db("Stock");
    var coll= dbo.collection("PublicCompanies");

    await coll.find(sqlQuery).toArray(function(err, items) {
        if (err) {
            console.log("Error: " + err);
        } 
        else {
            console.log("Items: ");
            //          !!!THIS console.log() was res.send() before!!!
            //console.log('Passed first res.send()');   !!!!!res.send() IS GIVING ERROR!!!!!
            // for (i=0; i<items.length; i++) {
            //     console.log("<Company " + (i + 1) + ": " + items[i].company + "> <Ticker:" + items[i].ticker + "> <Price:" + items[i].Price + ">");			
            //     tableOutput +=  '<tr>'
            //                         + '<td>' + items[i].company + '</td>'
            //                         + '<td>' + items[i].ticker + '</td>'
            //                         + '<td>' + items[i].Price + '</td>'
            //                     + '</tr>';
            // }
            res.send(items);
        }  
        // tableOutput += '</table>';
        // tableOutput += '<a href=/>Try Another Search</a>';
        // res.send(tableOutput);
    })
}

var express = require('express');
var app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded());
//Regular Part 2 Function
app.get('/', function(req, res, next){
    res.send(
        '<h1>Stock Search</h1>'
        + '<form id="searchForm" action= "/process" method= "get">'
            + '<label for="query">Enter Stock Ticker or Company Name:</label><br>'
            + '<input type="text" id="query" name= "searchQuery" required><br><br>'
            + '<input type="radio" id="ticker" name="searchType" value="ticker" checked>'
            + '<label for="ticker">Search by Ticker Symbol</label><br>'
            + '<input type="radio" id="company" name="searchType" value="company">'
            + '<label for="company">Search by Company Name</label><br><br>'
            + '<input type="submit" value="Search">'
        + '</form>'
    );
});

app.get('/process', function(req, res, next){
    var objquery = req.query;
    var txtSearchType = objquery.searchType;
    var sqlQuery = "";

    console.log('TxtSearchType is ' + txtSearchType);

    if (txtSearchType == "ticker") {
        sqlQuery = {"ticker" : objquery.searchQuery};
        //{"company": company, "ticker": ticker, "Price": price}
        console.log('objquery.searchQuery is ' + objquery.searchQuery);
    }
    else if (txtSearchType == "company"){
        sqlQuery = {"company" : objquery.searchQuery};
        console.log('objquery.searchQuery is ' + objquery.searchQuery);
    }
    else {
        return;
    }

    const MongoClient = require('mongodb').MongoClient;
    const connStr = "mongodb+srv://krishdhayal:testtest12@hw11.uhy4thi.mongodb.net/";
    client = new MongoClient(connStr);
    findQuery(sqlQuery, client, res);
    client.close();
});

//API Function
app.get('/getPrice', function(req, res, next){
    var objquery = req.query;
    var txtSearchType = objquery.searchType;
    var sqlQuery = "";

    console.log('TxtSearchType is ' + txtSearchType);

    if (txtSearchType == "ticker") {
        sqlQuery = {"ticker" : objquery.searchQuery};
        //{"company": company, "ticker": ticker, "Price": price}
        console.log('objquery.searchQuery is ' + objquery.searchQuery);
    }
    else if (txtSearchType == "company"){
        sqlQuery = {"company" : objquery.searchQuery};
        console.log('objquery.searchQuery is ' + objquery.searchQuery);
    }
    else {
        return;
    }

    const MongoClient = require('mongodb').MongoClient;
    const connStr = "mongodb+srv://krishdhayal:testtest12@hw11.uhy4thi.mongodb.net/";
    client = new MongoClient(connStr);
    retrievePrice(sqlQuery, client, res);
    client.close();
});
//app.listen(port);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
