const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://krishdhayal:testtest12@hw11.uhy4thi.mongodb.net/";

console.log("starting mongoclient");

await MongoClient.connect(url, async function(err, db) {
    if(err) { return console.log(err); }

    var dbo = db.db("Stock");
    var collection = dbo.collection('PublicCompanies');

    const file = require('readline');
    const fs = require('fs');
    var myFile = file.createInterface({
        input: fs.createReadStream('companies.csv')
    });

    console.log("completed createReadStream");
    
    var linenumber = 0;   
    var searchStart = 0;
    var companyComma = "";
    var tickerComma = "";

    var company = "";
    var ticker = "";
    var price = "";
 
    console.log("entering myFile.On");
    await myFile.on('line', async function(strLine) {
        console.log(strLine);
        if (linenumber != 0) {
            companyComma = strLine.indexOf(",", 0);
            company = strLine.substring(0, companyComma);

            tickerComma = strLine.indexOf(",", companyComma+1);
            ticker = strLine.substring(companyComma+1,tickerComma);
            
            price = strLine.substring(tickerComma+1, strLine.length);

            var data = {"company": company, "ticker": ticker, "Price": price};
            console.log(data);
            await collection.insertOne(data)
        }
        linenumber++;
    });
}); 
await db.close();