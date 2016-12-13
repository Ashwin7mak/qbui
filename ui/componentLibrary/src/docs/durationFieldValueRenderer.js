import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function DurationFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.DurationFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.DurationFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="DurationFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
