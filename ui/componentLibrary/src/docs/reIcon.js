import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function ReIconDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.ReIcon.descHtml}} />

            <ReactPlayground codeText={Examples.ReIcon} />

            <h2>Props</h2>
            <PropTable component="ReIcon" metadata={Metadata} />
        </div>
    );
}
