
let facets =  [
    {id : 101, name : "Types", type: "TEXT", mockFilter: true, blanks: true,
        values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
    {id : 102, name : "Names", type: "TEXT", mockFilter: true, blanks: false,
        values : [
            {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
            {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
            {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
            {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
        ]},
    {id : 103, name : "Status", type: "TEXT", mockFilter: true, blanks: false,
        values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
    {id : 104, name : "Flag", type: "CHECKBOX", mockFilter: true,  blanks: false,
        values : [{value: "No"}, {value: "Yes"}]},
    {id : 105, name : "Companies", type: "TEXT", mockFilter: true,  blanks: false,
        // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
        values : []}, // too many values for facets example
    //Date facets yet supported
    //{id : 4, name : "Dates", type: "date",  mockFilter: true, blanks: false,
    //    values[{range: {start: 1, end: 2}}],
];

export default facets;
