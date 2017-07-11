import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function QbLoaderDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.QbLoader.descHtml}} />

            <ReactPlayground codeText={Examples.QbLoader} />

            <h2>Props</h2>
            <PropTable component="QbLoader" metadata={Metadata} />
        </div>
    );
}
