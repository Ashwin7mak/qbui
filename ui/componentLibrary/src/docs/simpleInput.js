import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function SimpleInputDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.SimpleInput.descHtml}} />

            <ReactPlayground codeText={Examples.SimpleInput} />

            <h2>Props</h2>
            <PropTable component="SimpleInput" metadata={Metadata} />
        </div>
    );
}
