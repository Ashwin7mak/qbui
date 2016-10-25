import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function EmailFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.EmailFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.EmailFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="EmailFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
