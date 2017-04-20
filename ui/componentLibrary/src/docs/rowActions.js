import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function RowActionsDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.RowActions.descHtml}} />

            <ReactPlayground codeText={Examples.RowActions} />

            <h2>Props</h2>
            <PropTable component="RowActions" metadata={Metadata} />
        </div>
    );
}
