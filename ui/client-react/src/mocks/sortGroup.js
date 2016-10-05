let sortByFields = [{name:'QuickBase', descendOrder:true, type:'sort', unparsedVal:"-6", id: 6},
    //{name:'A longer field ', type:'sort', descendOrder:false, unparsedVal:"7", id: 7},
    //{name:'A longer field ', type:'sort', descendOrder:false, unparsedVal:"7"},
    {name:'A longer longer longeer field ', type:'sort', descendOrder:false, unparsedVal:"-8", id: 8},
    //{name:'A longer field ', type:'sort', descendOrder:false, unparsedVal:"9", id: 9},
    //{name:'A longer field ', type:'sort', descendOrder:false, unparsedVal:"10", id: 10},
    //{name:'A longer field ', type:'sort', descendOrder:false, unparsedVal:"11", id: 11},
    {name:'CompanyA', type:'sort', unparsedVal:"12", id: 12},
    {name:'CompanyB', type:'sort', unparsedVal:"13", id: 13}
];

let groupByFields = [
    {name:'Project', descendOrder:true, type:'group', unparsedVal:"-1:EQUALS", id: 1},
    //{name:'Region', descendOrder:true, type:'group', unparsedVal:"-3:EQUALS", id: 3},
    //{name:'Status', descendOrder:true, type:'group', unparsedVal:"-4:EQUALS", id: 4},
    // {name:'Date', descendOrder:false, type:'group', unparsedVal:"5:EQUALS", id: 5}
];

export default {SORT: sortByFields, GROUP: groupByFields};
