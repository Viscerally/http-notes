var http = require('http');

function makeRequest(callback) {
  http.get('http://api.nobelprize.org/v1/prize.json', function(response) {
    if(response.statusCode !== 200) {
      callback(new Error('Request Failed with Status Code ' + response.statusCode), null);
      return;
    }

    var body = '';
    response.setEncoding('utf-8');
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      callback(null, body);
    });
  });
}

function getFilteredWinners(data, filter) {
  var prizes = JSON.parse(data).prizes;

  var filtered = prizes.filter(prize => {
    return prize.category === filter;
  });

  var formatted = filtered.map(prize => {
    return prize.year + ' ' + prize.laureates.map(laureate => {
      return laureate.firstname + ' ' + laureate.surname;
    }).join(', ');
  });

  return formatted;
}

function printPhysicsWinners() {
  makeRequest(function(error, data) {
    if(error) {
      console.error(error);
    } else {
      console.log(getFilteredWinners(data, 'physics').join('\n'));
    }
  });
}

printPhysicsWinners();
