import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

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
