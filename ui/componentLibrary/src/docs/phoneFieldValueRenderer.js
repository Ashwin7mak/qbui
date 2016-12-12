import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function PhoneFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.PhoneFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.PhoneFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="PhoneFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
