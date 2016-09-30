import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TimeFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.TimeFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.TimeFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="TimeFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
