import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function UrlFieldValueEditorDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.UrlFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.UrlFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="UrlFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
