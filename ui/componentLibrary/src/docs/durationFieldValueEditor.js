import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function DurationFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.DurationFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.DurationFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="DurationFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
