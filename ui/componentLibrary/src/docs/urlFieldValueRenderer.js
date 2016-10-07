import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function UrlFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.UrlFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.UrlFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="UrlFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
