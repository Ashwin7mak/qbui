import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function checkBoxFieldValueRenderer() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.CheckBoxFieldValueRenderer.descHtml}} />

            <ReactPlayground codeText={Examples.CheckBoxFieldValueRenderer} />

            <h2>Props</h2>
            <PropTable component="CheckBoxFieldValueRenderer" metadata={Metadata} />
        </div>
    );
}
