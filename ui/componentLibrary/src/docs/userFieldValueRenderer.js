import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function UserFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.UserFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.UserFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="UserFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
