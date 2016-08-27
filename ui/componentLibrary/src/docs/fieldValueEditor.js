import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function FieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.FieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.FieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="FieldValueEditor" metadata={Metadata} />
        </div>
    );
}
