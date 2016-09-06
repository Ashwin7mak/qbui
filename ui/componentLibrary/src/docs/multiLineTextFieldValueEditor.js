import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function MultiLineTextFieldValueExample() {
    console.log('MultiLineTextFieldValue: ', Metadata.MultiLineTextFieldValueEditor);
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.MultiLineTextFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.MultiLineTextFieldValue} />

            <h2>Props</h2>
            <PropTable component="MultiLineTextFieldValueExample" metadata={Metadata} />
        </div>
    );
}
