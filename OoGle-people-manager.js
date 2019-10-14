//Author: Anderson Hudson

// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');
var programmer_array = [];
programmer_array.push(database);

// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on; changed this because port 3000 wouldn't work on my computer (?)
const port = 4124;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

app.get('/', (req, res) => {
	res.send(programmer_array);
	console.log(`Got all programmers!`);
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  
  let findProg = undefined;
  findProg = programmer_array.find(function(prog) {
		return prog.SID === id
		});

  if (findProg === undefined)
		throw new Error("INVALID ID");
  
  console.log(findProg);
  res.send(findProg);
  console.log(`Got a single programmer!`);
});

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body; // Hold your JSON in here!
  
  let findProg = undefined;
  findProg = programmer_array.find(function(prog) {
		return prog.SID === id
		});
  
  if (findProg != undefined) {
	console.log(body);
    let jsonStr = JSON.stringify(body);
    const newProg = JSON.parse(jsonStr);
	programmer_array[programmer_array.indexOf(findProg)] = newProg;
  } else {
	throw new Error("PROGRAMMER ID DOES NOT EXIST");
  }  
  
  res.send(`Fill me in to update values with ID: ${id}`);
});

app.post('/', (req, res) => {
  const body = req.body; // Hold your JSON in here!

  console.log(body);
  let jsonStr = JSON.stringify(body);
  const newProg = JSON.parse(jsonStr);
  
  programmer_array.push(newProg);
  res.send(`You sent: ${body}`);
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER (UNDEFINED) ROUTES AND RETURN AN ERROR MESSAGE
app.all('/', (req, res) => {
	throw new Error("UNDEFINED ROUTE");
	console.log(`Undefined route!`);
});

app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});