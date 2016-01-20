#Filtering

##UX Design docs 
[Search and Filtering interaction design](https://wiki.intuit.com/pages/viewpage.action?pageId=371138156)

- [large space proto](http://dx3z01.axshare.com/#p=large&c=1)
- [small space proto](http://dx3z01.axshare.com/#p=small__no_tokens_&c=1)


##Key Requirements
* Search/Filter on whole report
* searches tack on to previous search
* limit 5 filters max

##Questions for XD
- Icons? 
    - for search see - https://github.intuit.com/QuickBase/VisualAssets/tree/master/Approved/Controls, filtering icon to come
    - get new location from lisa 
- does gear icon in filter toolbar have any effect on filter/search?

##Figure out
- do we have a bookmark reroutable for filter state like current? 
    - to do make the params for the filtering be prams on report like current stack so its in history

##Core dependencies
* Get number of results for a query
    - see jira stories Aditi is doing
        - will have in report response facetFids array of fields to get facets on
        - to run a dynamic query we will send more query info to node like facets=[{fid: <fid>, values: <val1, val2>}, {fid: <fid2>, values: <val3, val4>}, ..]
* Get name for records from apps Table

##Components needed to render
- Search icon(for small to show/hide and focus input) and input box
- Filter icon for dropping down and showing filter active or not
   - Accordian popup under filter many opened at a time, initially all closed on desktop /mobile (large and nonloarge sizes 3/4of width)
   - Each field group has fieldname, id, type , sublist or component for field type
   - does backend request to get lists filter values for report x
- Report records count and filtering results count x of y filtered


##State needed to track
- loading results / not loading results
- debouce key input
    ```	
        You have to create a debounced function for each component instance, and not a singe debounced function at the class level, shared by each component instance.
        
        GOOD IDEA:
        var SearchBox = React.createClass({
            method: function() {...},
            componentWillMount: function() {
               this.method = _.debounce(this.method,100);
            },
        });
        Edit: with ES6 syntax (JsFiddle):
        
        class SearchBox extends React.Component {
            constructor() {
                super();
                this.method = _.debounce(this.method,1000);
            }
            method(e) { ... }
        }
```
- selected items per field type 
    - list of strings for text , boolean state, date range
    - reflects current selections in toolbare 
    - rerun search to update report like a page update

##Actions
- init
- select a filter - add to current search & update views cchecmark term, (add term to tokenlist for large)  update count
- unselect filter term  - update current search & update views
- unselect filter field  - update current search & update views

##Psuedocode

see also - http://wix.github.io/react-templates/
```
var Filtering = ReactTemplate.create({
  propTypes: {
    name: PropTypes.string
  },
  getDefaultProps: function() {
    return {name: 'Joe'};
  },
  render: function() {
    return (
      <div>
        Hello {this.props.name}!
        {this.props.children}
      </div>
    );
  }
})


===============

FilterList - Accordian

props -
 textfilterdata [ {section.title element str, 
             sections.children [elements to show on expand] 

                    //methods to return whats slected, select(1) deslect(1), deselect(all)
             section.keyid -  the id so we can add a hook to clear all selections within it ]
state - 
 [for each section is it open or closed]
 [for section child item is selected or not] 
 

```



example Faceting data sent to client from current stack 

```

  "data": {
    "originalRIDListID": "mi5",
    "originalQID": 1,
    "queryType": "table",
    "baseQID": 1,
    "visColList": "",
    "askTheUserParams": "",
    "facetListJSON": [
      {
        "id": 6,
        "fieldType": "US",
        "name": "Requestor",
        "dataType": "user",
        "hasEmpty": false,
        "tooMany": false,
        "isDisabled": false,
        "reason": "",
        "aspects": [
          {
            "value": "Ansell, Gideon",
            "uid": -57637193
          },
          {
            "value": "Ardito, Matthew",
            "uid": -58431281
          },
          {
            "value": "Arias, Jonathan",
            "uid": -58850889
          },
          {
            "value": "Ayachit, Mihir",
            "uid": -57466749
          },
          {
            "value": "Badolato, Jennifer",
            "uid": -55766268
          },
          {
            "value": "Bahl, Gaurav",
            "uid": -58018867
          },
          {
            "value": "Baxter, Nick",
            "uid": -58265410
          },
          {
            "value": "Beaver, David",
            "uid": -58191706
          },
          {
            "value": "Benghiat, Gilbert",
            "uid": -58175295
          },
          {
            "value": "Bergeron, Shayna",
            "uid": -58956320
          },
          {
            "value": "Beyer, Rick",
            "uid": -58431636
          },
          {
            "value": "Bixler, Gene",
            "uid": -58341126
          },
          {
            "value": "Bloomquist, Meredith L",
            "uid": -57144726
          },
          {
            "value": "Blumenfield, Neil",
            "uid": -58265428
          },
          {
            "value": "Bogart, Marjorie Lorraine",
            "uid": -59045578
          },
          {
            "value": "Bradshaw, Brendan M.",
            "uid": -55691140
          },
          {
            "value": "Buday, Benjamin",
            "uid": -58274787
          },
          {
            "value": "Busalacchi, Eric",
            "uid": -58191707
          },
          {
            "value": "Cannon, Chris",
            "uid": -56865700
          },
          {
            "value": "Carione, John M.",
            "uid": -58820348
          },
          {
            "value": "Cary, Lindsay",
            "uid": -58589914
          },
          {
            "value": "Chin, Jeffery",
            "uid": -53762842
          },
          {
            "value": "Chopperla, Swetha",
            "uid": -58533978
          },
          {
            "value": "Cocchiaro, Carl Maurice",
            "uid": -58746098
          },
          {
            "value": "Colford, Peter",
            "uid": -58624704
          },
          {
            "value": "Contreras, Eddie",
            "uid": -58656906
          },
          {
            "value": "Copeland, Kyle",
            "uid": -56794193
          },
          {
            "value": "Costandi-Gomes, Amy",
            "uid": -58178389
          },
          {
            "value": "Davis, Betsy",
            "uid": -56339086
          },
          {
            "value": "De Jesus, David",
            "uid": -58379889
          },
          {
            "value": "De Jesus, David",
            "uid": -58359109
          },
          {
            "value": "De, Soumya",
            "uid": -17273
          },
          {
            "value": "DeSimone, David",
            "uid": -59080597
          },
          {
            "value": "Deese, Stephen Bradley",
            "uid": -58390398
          },
          {
            "value": "Differ, Christie",
            "uid": -58171437
          },
          {
            "value": "Dorsey, John",
            "uid": -58830247
          },
          {
            "value": "DuBois, Wendy",
            "uid": -199088
          },
          {
            "value": "Dugas, Keith",
            "uid": -58017756
          },
          {
            "value": "Eagar, Matt",
            "uid": -58203558
          },
          {
            "value": "Eder, Brooke",
            "uid": -58292570
          },
          {
            "value": "Edmond, Bradford John",
            "uid": -58431483
          },
          {
            "value": "Eiref, Kana",
            "uid": -58716793
          },
          {
            "value": "Ellerman, Eloyse",
            "uid": -10351
          },
          {
            "value": "Felix, Philippe",
            "uid": -58990675
          },
          {
            "value": "Field, Mark",
            "uid": -58379472
          },
          {
            "value": "Fleming, Dee",
            "uid": -58403637
          },
          {
            "value": "Fletcher, Joseph",
            "uid": -56425514
          },
          {
            "value": "Fox, Sean",
            "uid": -59020389
          },
          {
            "value": "Frawley, Brian",
            "uid": -58390399
          },
          {
            "value": "Freitas, Kate",
            "uid": -57394873
          },
          {
            "value": "Galloway, Scott",
            "uid": -55022009
          },
          {
            "value": "Garner, Nathan",
            "uid": -58210409
          },
          {
            "value": "Gass, Marykate",
            "uid": -58573046
          },
          {
            "value": "Ghosh, Urmi",
            "uid": -58803636
          },
          {
            "value": "Gibbs, Brendan",
            "uid": -58096329
          },
          {
            "value": "Gilday, Mark",
            "uid": -58262129
          },
          {
            "value": "Goel, Aditi",
            "uid": -56522315
          },
          {
            "value": "Goodwin, Benjamin",
            "uid": -56252444
          },
          {
            "value": "Govindaswamy, Tharani Dharan",
            "uid": -58747220
          },
          {
            "value": "Greenwood, Matt",
            "uid": -56334734
          },
          {
            "value": "Hale, Robert Ellery",
            "uid": -58516857
          },
          {
            "value": "Hansen, Eric",
            "uid": -56769106
          },
          {
            "value": "Hardcastle, Sean",
            "uid": -57970782
          },
          {
            "value": "Haro, Sergio",
            "uid": -56762094
          },
          {
            "value": "Harrison, Blake",
            "uid": -57530939
          },
          {
            "value": "Hatch, Don",
            "uid": -56686522
          },
          {
            "value": "Hershon, Sharon",
            "uid": -56632692
          },
          {
            "value": "Herzig, Kerry E",
            "uid": -58197819
          },
          {
            "value": "Hidalgo, Jose",
            "uid": -58828417
          },
          {
            "value": "Higgins, Kristin",
            "uid": -58267041
          },
          {
            "value": "Hoover, Adam",
            "uid": -58274784
          },
          {
            "value": "Isaman, David",
            "uid": -13595
          },
          {
            "value": "Jameson, Kathy",
            "uid": -59146593
          },
          {
            "value": "Jones, Sam",
            "uid": -58352260
          },
          {
            "value": "Jr, Allen M Chaves",
            "uid": -56436355
          },
          {
            "value": "Jr., John Zilch",
            "uid": -57962070
          },
          {
            "value": "Kamineni, Srilakshmi",
            "uid": -58467607
          },
          {
            "value": "Karish, Edward",
            "uid": -57124643
          },
          {
            "value": "Kawakami, Katsutoshi",
            "uid": -58720733
          },
          {
            "value": "Kelly, Megan",
            "uid": -59044310
          },
          {
            "value": "Keswani, Claude",
            "uid": -56295968
          },
          {
            "value": "Kowal, Adam",
            "uid": -32926
          },
          {
            "value": "Krishnamurthy, Deepashree",
            "uid": -55442624
          },
          {
            "value": "Kshetri, Kunjan",
            "uid": -57154488
          },
          {
            "value": "Kuo, Christine",
            "uid": -58489495
          },
          {
            "value": "LaBak, Kenneth",
            "uid": -56516392
          },
          {
            "value": "Labbe, Marc",
            "uid": -58858988
          },
          {
            "value": "Lahey, Daniel J",
            "uid": -57954021
          },
          {
            "value": "LeDuc, Mike",
            "uid": -58474508
          },
          {
            "value": "Leto, Graham",
            "uid": -58789262
          },
          {
            "value": "Linkovich, Denise",
            "uid": -58346868
          },
          {
            "value": "Little, Eliza",
            "uid": -56774845
          },
          {
            "value": "Lu, Ruobing",
            "uid": -58238275
          },
          {
            "value": "MacLean, Scott",
            "uid": -56335083
          },
          {
            "value": "Maglione, Angela Marie",
            "uid": -59060958
          },
          {
            "value": "Maloney, Chris",
            "uid": -58267040
          },
          {
            "value": "Maloney, Elliot",
            "uid": -58265411
          },
          {
            "value": "Maron, Charlene",
            "uid": -51231114
          },
          {
            "value": "Martinez, Claire",
            "uid": -57044667
          },
          {
            "value": "Mattocks, Scott",
            "uid": -58983098
          },
          {
            "value": "McCann, Elizabeth",
            "uid": -56007552
          },
          {
            "value": "McDonald, Robert",
            "uid": -55441408
          },
          {
            "value": "Merlino, Anthony",
            "uid": -59185425
          },
          {
            "value": "Mills, Mark",
            "uid": -58268195
          },
          {
            "value": "Mohanti, Sanjeev",
            "uid": -56633674
          },
          {
            "value": "Molloy, Peter",
            "uid": -17047
          },
          {
            "value": "Morris, Isaiah",
            "uid": -56845345
          },
          {
            "value": "Morris, Matthew",
            "uid": -55836167
          },
          {
            "value": "Motyka, Karen",
            "uid": -11357
          },
          {
            "value": "Munukutla, Surya Kiran",
            "uid": -58139327
          },
          {
            "value": "Munukutla, Surya Kiran",
            "uid": -57913083
          },
          {
            "value": "Murphy, Karen Maria",
            "uid": -58591762
          },
          {
            "value": "Murray, Ryan",
            "uid": -58754860
          },
          {
            "value": "Musale, Ashish R.",
            "uid": -57020730
          },
          {
            "value": "Nelson, Jon",
            "uid": -56351904
          },
          {
            "value": "Neogi, Depankar",
            "uid": -57200186
          },
          {
            "value": "Newcomb, Andrew",
            "uid": -769034
          },
          {
            "value": "Nicolau, Clay",
            "uid": -58789957
          },
          {
            "value": "Norton, Alicia",
            "uid": -58352695
          },
          {
            "value": "Ogilvie, Eric",
            "uid": -57690482
          },
          {
            "value": "Oliver, Josh",
            "uid": -58170959
          },
          {
            "value": "Olsen Admin, Frode",
            "uid": -57292919
          },
          {
            "value": "Olsen, Frode",
            "uid": -57281012
          },
          {
            "value": "Olson, Brad",
            "uid": -57320231
          },
          {
            "value": "Patterson, Nolan",
            "uid": -58715936
          },
          {
            "value": "Pilachowski, Robert M",
            "uid": -56637349
          },
          {
            "value": "Pitman, Christopher",
            "uid": -58020583
          },
          {
            "value": "Pitts, Walt",
            "uid": -54283262
          },
          {
            "value": "Porter, Melanie",
            "uid": -56697580
          },
          {
            "value": "Powis, Phil",
            "uid": -57109930
          },
          {
            "value": "Quercia, Nathan",
            "uid": -59120646
          },
          {
            "value": "Ramesh, Soumya",
            "uid": -59046534
          },
          {
            "value": "Reynolds, Keith",
            "uid": -58365939
          },
          {
            "value": "Richard, Jodi",
            "uid": -58792313
          },
          {
            "value": "Riedel, Tim",
            "uid": -56985380
          },
          {
            "value": "Rivera, Jay",
            "uid": -58331734
          },
          {
            "value": "Rokos, Brandon",
            "uid": -58967748
          },
          {
            "value": "Roper, Mark",
            "uid": -57676183
          },
          {
            "value": "Rosson, Jeffrey",
            "uid": -56473888
          },
          {
            "value": "Ruscio, Gina",
            "uid": -58112603
          },
          {
            "value": "Saforrian, Matthew J",
            "uid": -58895389
          },
          {
            "value": "Sankaran, Ashwin",
            "uid": -58654455
          },
          {
            "value": "Scarpetti, Andrew",
            "uid": -56972896
          },
          {
            "value": "Schweers, Matt",
            "uid": -58531366
          },
          {
            "value": "Shain, Adam",
            "uid": -58762091
          },
          {
            "value": "Shamanna, Ram",
            "uid": -57798160
          },
          {
            "value": "Shearin, Sybil",
            "uid": -57504921
          },
          {
            "value": "Sheffield, Julie",
            "uid": -57156094
          },
          {
            "value": "Shyres, Todd",
            "uid": -56819445
          },
          {
            "value": "Skrzypczak, Michael",
            "uid": -56952615
          },
          {
            "value": "Solat, Robert J.",
            "uid": -58703473
          },
          {
            "value": "Spikes, Mike",
            "uid": -57495483
          },
          {
            "value": "St.Germain, Mariana",
            "uid": -58269839
          },
          {
            "value": "Stacey, Josh",
            "uid": -58014873
          },
          {
            "value": "Stanton, Jeffrey",
            "uid": -56985693
          },
          {
            "value": "Stevens, Drew",
            "uid": -56605150
          },
          {
            "value": "Stewart, Blake",
            "uid": -58265379
          },
          {
            "value": "Stewart, Ian",
            "uid": -57861991
          },
          {
            "value": "Swain, Rhonda",
            "uid": -10146
          },
          {
            "value": "Taylor, Kristen",
            "uid": -56739835
          },
          {
            "value": "Trachy, Kirk",
            "uid": -55692594
          },
          {
            "value": "Varley, Andrew W.",
            "uid": -58487903
          },
          {
            "value": "Vu, Giao Tien",
            "uid": -58268196
          },
          {
            "value": "Walker, Beth",
            "uid": -56291673
          },
          {
            "value": "Wang, Tao",
            "uid": -58179214
          },
          {
            "value": "Wang, Wuyi",
            "uid": -57702739
          },
          {
            "value": "Weiner, Andrew D",
            "uid": -59168890
          },
          {
            "value": "Wellman, Keith Brian",
            "uid": -58418223
          },
          {
            "value": "Wiggins, Lawrence",
            "uid": -58096332
          },
          {
            "value": "Williamson, Scott",
            "uid": -56437547
          },
          {
            "value": "Wingham, Rory",
            "uid": -58417814
          },
          {
            "value": "Yanofsky, Jill",
            "uid": -58602695
          },
          {
            "value": "Zhukovsky, George",
            "uid": -58076189
          },
          {
            "value": "Zimring, Micah",
            "uid": -57801064
          },
          {
            "value": "sampath, abishek",
            "uid": -57317866
          },
          {
            "value": "schneider, cleo",
            "uid": -58706709
          }
        ]
      },
      {
        "id": 7,
        "fieldType": "TX",
        "name": "Request Type",
        "dataType": "text",
        "hasEmpty": true,
        "tooMany": false,
        "isDisabled": false,
        "reason": "",
        "aspects": [
          {
            "value": "Access - New Hire"
          },
          {
            "value": "Access - Role Change"
          },
          {
            "value": "Account Cancellation"
          },
          {
            "value": "BTFW Support"
          },
          {
            "value": "Biz Ops Support"
          },
          {
            "value": "Connection Cloud"
          },
          {
            "value": "Copy Application"
          },
          {
            "value": "Copy SQL tables"
          },
          {
            "value": "Customer Central related"
          },
          {
            "value": "Decrypt SB1 files"
          },
          {
            "value": "Decrypt sb1 files"
          },
          {
            "value": "Feature Switch Change"
          },
          {
            "value": "Git Repos"
          },
          {
            "value": "Increase hard drive space"
          },
          {
            "value": "Lab - Update Environment"
          },
          {
            "value": "Lab Request - Add to domain"
          },
          {
            "value": "Lab Request - Copy App to Lab"
          },
          {
            "value": "Lab Request - Environment Build"
          },
          {
            "value": "Lab Request - Troubleshooting"
          },
          {
            "value": "Lab Request - Update Environment"
          },
          {
            "value": "Lab Request - Update QuickBase"
          },
          {
            "value": "Mini Enviornment (QA)"
          },
          {
            "value": "Mini-Env"
          },
          {
            "value": "New Relic Access"
          },
          {
            "value": "New system user"
          },
          {
            "value": "Other"
          },
          {
            "value": "Permissions"
          },
          {
            "value": "Permissions Change"
          },
          {
            "value": "Quarantine App"
          },
          {
            "value": "QuickBase Access - New Hire"
          },
          {
            "value": "QuickBase Access - Role Change"
          },
          {
            "value": "QuickBase Sync"
          },
          {
            "value": "Realm Admin"
          },
          {
            "value": "Restore Request"
          },
          {
            "value": "Run script in pre-prod"
          },
          {
            "value": "SQL Script Development"
          },
          {
            "value": "SQL statement for Production"
          },
          {
            "value": "SVN Access"
          },
          {
            "value": "Script Execution"
          },
          {
            "value": "Shadow Capture"
          },
          {
            "value": "Shadow Parallel"
          },
          {
            "value": "Shadow Verify"
          },
          {
            "value": "Splunk Assistance"
          },
          {
            "value": "Troubleshooting"
          },
          {
            "value": "Update app in Gamma"
          },
          {
            "value": "Zip of App"
          },
          {
            "value": "qbanalytics change"
          },
          {
            "value": "server config"
          },
          {
            "value": "(blank)",
            "isEmpty": true
          }
        ]
      },
      {
        "id": 9,
        "fieldType": "DT",
        "name": "Date Needed",
        "dataType": "date",
        "hasEmpty": false,
        "tooMany": false,
        "min": 1364947200000,
        "max": 1450396800000,
        "isDisabled": false,
        "reason": "",
        "aspects": []
      },
      {
        "id": 11,
        "fieldType": "TX",
        "name": "Short Title",
        "dataType": "text",
        "hasEmpty": true,
        "tooMany": true,
        "isDisabled": true,
        "reason": "Too many values",
        "aspects": [
          {
            "value": "(blank)",
            "isEmpty": true
          }
        ]
      },
      {
        "id": 12,
        "fieldType": "CB",
        "name": "Manager Approval",
        "dataType": "bool",
        "hasEmpty": false,
        "tooMany": false,
        "isDisabled": false,
        "reason": "",
        "aspects": [
          {
            "value": "No"
          },
          {
            "value": "Yes"
          }
        ]
      }
    ],
    "attentionRow": "#rid",
    "clientFacetString": "{}"
  },
  "options": {
    "facetDebounceInterval": 500,
    "facetDialogDebounceInterval": 200,
    "numItemsPerDialogCol": 15,
    "facetVisValues": 60,
    "tableHomeType": {
      "type": "Report",
      "qid": 1
    },
    "chartToImageEnabled": true
  }
}"
```