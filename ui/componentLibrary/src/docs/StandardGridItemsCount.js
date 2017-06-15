import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function StandardGridItemsCountDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.StandardGridItemsCount.descHtml}} />

            <ReactPlayground codeText={Examples.StandardGridItemsCount} />

            <h2>Props</h2>
            <PropTable component="StandardGridItemsCount" metadata={Metadata} />
        </div>
    );
}
