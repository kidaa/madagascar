#Madagascar

[![NPM version](https://badge.fury.io/js/madagascar.svg)](http://badge.fury.io/js/madagascar)
[![Build Status](https://travis-ci.org/Olapic/madagascar.svg?branch=master)](https://travis-ci.org/Olapic/madagascar)

Madagascar wraps a bulk of HTTP requests, collect the responses and sends them back as one.

# Install

```sh
$ npm install madagascar
```
#API

**`madagascar(config)`** in where *`config`* is an object that may contains

- *string* `domains.baseUrl` … base URL respect to which every relative URL will be taken, e.g., *"https://api.olapic.com/v1"*
- *array* `domains.restrictTo` … list of allowed domains. If it's not present, it will be allowed requests to any domain, e.g., *["api.olapic.com"]*
- *object* `defaultHeaders` … contains a set of default headers to be sent on every request to the upstream API, e.g., *{"Accept": "application/json", "Link": "&lt;/&gt;"}*
- *int* `batchMaxSize` … Specifies the maximum amount of request allowed on a single batch. Its default value is *30*.

and returns an object containing:

- *function* **`send(payload, callback)`**

where *`payload`* may have the following members

- *string* `base_url` … acts in the same way as `config.domains.baseUrl` does.
- *object* `authentication` … authentication object. It will be merged into the query string of every request.
- *array* `batch` … objects corresponding to a standar HTTP request.
  - *string* `relative_url` … relative to the *base_url* specified by this payload or by config, e.g., *'/hello'*
  - *string* `url` … must be fully qualified, e.g., 'https://api.olapic.com/hello?count=2'. It supersedes the *relative_url* parameter.
  - *string* `method` … HTTP method like *'GET'*.
  - *object* headers … may contain any valid HTTP header in the form: `{name: value}`, e.g., `{'Content-type': 'application/json'}`
  - *string* `body` … must be already encoded according to the Content-Type specified on the headers of the request.

and **`callback`** must be a **`function(response)`**, in where

- `response` would be an array of response objects, in the corresponding order to the *batch* received. Each of one should contain
  - *int* `status` … HTTP status code
  - *object* `headers` … response headers.
  - *string* `body` … response body as it comes from the upstream.

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

#Server example


```js
var express = require('express'),
    madagascar = require('madagascar'),
    bodyParser = require('body-parser'),
    app = express(),
    gate;

app.use(bodyParser.json());

gate = madagascar({
  domains: {
    baseUrl: 'https://api.olapic.com/'
  }
});

app.post('/', function(req, res){
  gate(req.body, function(responses) {
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

##MIT

Copyright (c) 2014 Olapic INC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
Software is furnished to do so, subject to the following
copies of the Software, and to permit persons to whom the
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
