import React from 'react';

import Metadata from '../src/Metadata';
import ReactPlayground from '../src/ReactPlayground';
import Examples from '../src/Examples';
import PropTable from '../src/PropTable';
import QBicon from '../../qbIcon/qbIcon';

export default function QBIconDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QBicon.descHtml}} />

            <ReactPlayground codeText={Examples.QBIcon} />

            <h2>Props</h2>
            <PropTable component="QBicon" metadata={Metadata} />
        </div>
    );
}
