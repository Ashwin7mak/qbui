import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function NumericFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.NumericFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.NumericFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="NumericFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
