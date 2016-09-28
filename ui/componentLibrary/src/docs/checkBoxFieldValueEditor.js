import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function checkBoxFieldValueEditor() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.CheckBoxFieldValueEditor.descHtml}} />

            <ReactPlayground codeText={Examples.CheckBoxFieldValueEditor} />

            <h2>Props</h2>
            <PropTable component="CheckBoxFieldValueEditor" metadata={Metadata} />
        </div>
    );
}
