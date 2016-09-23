import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function UserFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.UserFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.UserFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="UserFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
