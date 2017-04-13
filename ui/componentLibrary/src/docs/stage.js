import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function StageDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.Stage.descHtml}} />

            <ReactPlayground codeText={Examples.Stage} />

            <h2>Props</h2>
            <PropTable component="Stage" metadata={Metadata} />
        </div>
    );
}
