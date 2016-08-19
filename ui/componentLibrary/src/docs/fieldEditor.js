import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function FieldEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.FieldEditor.descHtml}} />

            <ReactPlayground codeText={Examples.FieldEditor} />

            <h2>Props</h2>
            <PropTable component="FieldEditor" metadata={Metadata} />
        </div>
    );
}
