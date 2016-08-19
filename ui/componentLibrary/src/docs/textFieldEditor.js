import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TextFieldEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TextFieldEditor.descHtml}} />

            <ReactPlayground codeText={Examples.TextFieldEditor} />

            <h2>Props</h2>
            <PropTable component="TextFieldEditor" metadata={Metadata} />
        </div>
    );
}
