import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TextFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TextFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.TextFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="TextFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
