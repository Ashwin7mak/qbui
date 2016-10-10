import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function DateFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.DateFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.DateFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="DateFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
