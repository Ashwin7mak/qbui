import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function MultiChoiceFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.MultiChoiceFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.MultiChoiceFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="MultiChoiceFieldValueEditor" metadata={Metadata} />
        </div>
    );
}