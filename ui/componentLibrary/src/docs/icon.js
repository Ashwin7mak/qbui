import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function IconDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.Icon.descHtml}} />

            <ReactPlayground codeText={Examples.Icon} />

            <h2>Props</h2>
            <PropTable component="Icon" metadata={Metadata} />
        </div>
    );
}
