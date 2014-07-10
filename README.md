#Madagascar

[![Build Status](https://travis-ci.org/Olapic/madagascar.svg?branch=master)](https://travis-ci.org/Olapic/madagascar)

Madagascar wraps a bulk of HTTP requests, collect the responses and sends them back as one.

# Install

```sh
$ npm install madagascar
```

# Usage

```js
var madagascar = require('madagascar');

var payload = {
  base_url: 'https://api.olapic.com',
  authentication:
  {
    access_token: 'abcdef'
  }
  batch: [
    {
      url: 'https://api.photorank.me/media',
      method: 'POST',
      body: 'caption=%23madagascar&link=http%3A%2F%2Finstagram.com%2Fp%2FqMN-RWKc9U',
    },
    {
      relative_url: '/',
      headers:
      {
        'Accept': 'text/html; q=0.8'
      }
      method: 'GET',
    }
  ]
};

madagascar(payload, function(responses){
  /*
  response = [
    {
      status: 200,
      headers:
      {
        'Content-Type': 'text/javascript; charset=UTF-8'
      },
      body: '{\"id\":\"…\"}'
    },
    {
      status: 400,
      headers:
      {
        'Content-Type': 'text/javascript; charset=UTF-8'
      },
      body:'{\"error\":\"…\"}'
    },
  ];
  */
});

```

#Example


```js
var express = require('express'),
    madagascar = require('madagascar'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.post('/', function(req, res){
  madagascar(req.body.payload, function(responses) {
    res.send(responses);
  });
});

app.listen(3000);

```

```sh
curl -d "`cat payload.json`" -H "Content-Type: application/json" http://localhost:3000/
[{"status":200,"headers":{"server":"nginx"...
```

# License

[LICENSE-MIT](https://github.com/Olapic/madagascar/blob/master/LICENSE-MIT)
