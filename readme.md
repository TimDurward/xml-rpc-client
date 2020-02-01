# Tiny XML-RPC Client

## How to use

```js
const { XMLRPCClient } = require('xml-rpc-client');

// Build XML-RPC client with options.
const opts = {
  hostname: 'production.vpn.com',
  transport_protocol: 'https',
  port: 943,
  path: '/RPC2',
  basic_auth: {
    user: 'admin',
    password: 'password'
  }
};

const xmlrpc = new XMLRPCClient(opts);

// Pass in an xml-rpc payload to request method

// Follow spec https://github.com/TimDurward/xml-rpc-client/blob/master/spec/index.js

// Also see official xml-rpc spec for more info http://xmlrpc.com/spec.md
const getSummary = {
  methodCall: [
    { methodName: 'GetVPNSummary' },
    {
      params: []
    }
  ]
};

xmlrpc.request(getSummary).then(data => console.log(data))
```
