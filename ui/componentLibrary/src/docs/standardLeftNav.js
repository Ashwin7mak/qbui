import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function StandardLeftNavDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.StandardLeftNav.descHtml}} />

            <ReactPlayground codeText={Examples.StandardLeftNav} />

            <h2>Props</h2>
            <PropTable component="StandardLeftNav" metadata={Metadata} />
        </div>
    );
}
