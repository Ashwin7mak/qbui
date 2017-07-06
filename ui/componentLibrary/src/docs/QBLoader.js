import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function QBLoaderDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QBLoader.descHtml}} />

            <ReactPlayground codeText={Examples.QBLoader} />

            <h2>Props</h2>
            <PropTable component="QBLoader" metadata={Metadata} />
        </div>
    );
}
