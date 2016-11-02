import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function QBModalDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QBModal.descHtml}} />

            <ReactPlayground codeText={Examples.QBModal} />

            <h2>Props</h2>
            <PropTable component="QBModal" metadata={Metadata} />
        </div>
    );
}
