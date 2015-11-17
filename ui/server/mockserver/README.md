To mock the java backend with fixed responses 

* from the ui directory run

```
node server/mockserver/mocker.js
```


* add `-p _nnnn_` to specify a port number other than the default 3030

* add `-h nameofhost` to specify a host name other than localhost

* To run serve with reload of server on changes to db file or mocker.js use
`npm run mockServer 
`

* Edit your local.json config file to set environment to now use the mocker for the java server:

```
javaHost:'http://localhost:3030',
```

* Then run the node layer as usual via `grunt serve` or `NODE_ENV=local npm start`

This will respond to request to the java api using the canned db.json file ( NOTE: No swagger doc support, browsing to http://localhost:3030 with display he routes available in the db.json file )

Make any additions necessary to db.json to handle new apis

In addition custom programmatic responses can be added to mocker.js see ticket api response for example.

