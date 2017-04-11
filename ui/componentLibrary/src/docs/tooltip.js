import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TooltipDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.Tooltip.descHtml}} />

            <ReactPlayground codeText={Examples.Tooltip} />

            <h2>Props</h2>
            <PropTable component="Tooltip" metadata={Metadata} />
        </div>
    );
}
