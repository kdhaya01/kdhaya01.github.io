const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

let uri = 'mongodb://localhost:27017';
let client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('usersDB');
        const collection = database.collection('contacts');
        const contacts = JSON.parse(fs.readFileSync('/path/to/contacts.json', 'UTF-8'));

        const result = await collection.insertMany(contacts);
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);



const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://krishdhayal:testtest12@hw11.uhy4thi.mongodb.net/";

  MongoClient.connect(url, async function(err, db) {
    if(err) { return console.log(err); }
  
    var dbo = db.db("Stock");
	var collection = dbo.collection('PublicCompanies');

    const file = require('readline');
    const fs = require('fs');
    var myFile = file.createInterface({
        input: fs.createReadStream('companies.csv')
    });
    
    var linenumber = 0;   
    var searchStart = 0;
    var companyComma = "";
    var tickerComma = "";

    var company = "";
    var ticker = "";
    var price = "";

    myFile.on('line', function(strLine) {
        if (linenumber != 0) {
            companyComma = strLine.indexOf(",", 0)
            company = '"' + strLine.substring(0, companyComma-1) + '"';

            tickerComma = strLine.indexOf(",", companyComma+1);
            ticker = '"' + strLine.substring(companyComma+1,tickerComma-1) + '"';
            
            price = '"' + strLine.substring(tickerComma+1, strLine.length-1) + '"';

            var data = {"company": company, "ticker": ticker, "Price": price}
            collection.insertOne(data, function(err, res) {
                if (err) {return console.log(err)};
            });
        }
    });
    db.close();
});  // end connect