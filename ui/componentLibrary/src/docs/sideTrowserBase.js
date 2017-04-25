import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function SideTrowserBaseDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.SideTrowserBase.descHtml}} />

            <ReactPlayground codeText={Examples.SideTrowserBase} />

            <h2>Props</h2>
            <PropTable component="SideTrowserBase" metadata={Metadata} />
        </div>
    );
}
