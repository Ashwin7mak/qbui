# Mock Server
To mock the java backend with fixed responses 

* from the ui directory run

```
node server/src/mockserver/mocker.js
```


* add `-p<_nnnn_>` to specify a port number other than the default 3030

* add `-h<nameofhost>` to specify a host name other than localhost

* add `-f<filename>` to specify a file name of mock data other than db.json. The file must be in the same directory as mocker.js

* To run serve with reload of server on changes to db file or mocker.js use
`npm run mockServer 
`

* Edit your local.json config file to set environment to now use the mocker for the java server:

```
javaHost:'http://localhost:3030',
```

This will respond to request to the java api using the canned db.json file ( NOTE: No swagger doc support, browsing to http://localhost:3030 with display he routes available in the db.json file )

Make any additions necessary to db.json to handle new apis

In addition custom programmatic responses can be added to mocker.js see ticket api response for example.

Then run the node layer as usual via `grunt serve` or `NODE_ENV=local npm start`

## Mocking Legacy Stack
To use as your legacy mock server, then edit your local.json config file to set the appropriate env
```
isMockServer: true,
legacyBase: '.ns.quickbase-dev.com:3030',
```

Then run the mock server from the ui directory
```
node server/src/mockserver/mocker.js -f legacyStack.json
```

## Adding new mock services
If you want to mock other services, create a new json file under `server/src/mockserver`. The json should be a simple
map. The key is the route to match. The value is the json value to return. For example,
```
{
    "/hello/world/1" : {id : 1},
    "/hello/world/2" : {id : 2},
}
```

So if you visited `http://localhost:3030/hello/world/2` you would get `{id: 2}` as the response. Note that this currently only
supports mocking GET requests.




