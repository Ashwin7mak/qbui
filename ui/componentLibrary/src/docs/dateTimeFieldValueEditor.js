import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function DateTimeFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.DateTimeFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.DateTimeFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="DateTimeFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
