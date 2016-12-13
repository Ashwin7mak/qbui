import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function PhoneFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.PhoneFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.PhoneFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="PhoneFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
