import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TextFieldValueRendererDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TextFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.TextFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="TextFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
