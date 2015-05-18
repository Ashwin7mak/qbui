#UI Layer Data Services

The angular code will need some data services for populating the grid controller used for rendering the report data. The grid controller will be used in various contexts. In some cases the grid will be rendering the Quickbase application system elements and in other cases the grid will be used to render the customer records of their tables in grid reports. 

When using the grid for rendering customer data the schema of that data is dynamic and thus will need to get the schema column definitions in a format ready for the grid configuration in addition to handing the data to the grid.


##Low level Angular Service

Resource for all api endpoints
with ability to do all the following crud ops if implemented:

```
 var Entity = $resource('/api/entity/:id', { id: '@id' }, { 
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} 
  'getschema' :
  };
  
  Entity.prototype.extraFunctionalityForResource = function() {
  	// do additional requests as needed
  }
  
  return Entity;
  
i.e.

  var User = $resource('/user/:userId', {userId:'@id'});
  var user = User.get({userId:123}, function() {
        user.abc = true;
        user.$save();
  });
  
TODO - look at Restangular more flexible that $resource and supports resource relationships

  
```
 for the following Entities : realms, apps, tables, table, record, report, field
 
##Angular layer APIs to add for lighthouse
These pass thu angular resource apis will call to the Node layer

* health
* app.table.Report
	* run a report : given app, table, report id params
		* get datarecords with formatted data, (using reports clist) 		* get starting offset and numrows
		
* Entities to render Post-Lighthouse 
	* Users	
	* Realms 
	* Apps
		* Tables
			* Fields
		* Reports
		* 	given app, table, report id 
		* get report info column info, and Sort criteria
			* handle sort info
		* Roles


## Grid data Services 
pass in service object which transforms API response

* given the service construct the grid data options
	* a promise returning method to get a page of data from the resource give a page number and size of pages 
	* add promised method to the resource to calc or return set the fixed column names
		* dynamic data gets column info from dataservice
		* (later) get the sort information
			* on the report resource load from report description
			* on other resource sort by name or by user local settings
		* set the column alignment based on 
			* loaded data types


## Managing State of Paging Data
* flag endofdata offset known
	* 	if get all data < MAX_RECORDS_IN_REQUEST in 1st request
		* set flag to use clientside sort
	* else set flag to use serve side sort
*  num of records/items per page
* current page starting offset in record list ( record **10** - 20 of ? )
* end of page offset in record list ( record 10 - **20** of ? )
* end of data offset ( record 10 - 20 of **100** ) 





