import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TopNavDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TopNav.descHtml}} />

            <ReactPlayground codeText={Examples.TopNav} />

            <h2>Props</h2>
            <PropTable component="TopNav" metadata={Metadata} />
        </div>
    );
}
