import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function ColorPickerDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.ColorPicker.descHtml}} />

            <ReactPlayground codeText={Examples.ColorPicker} />

            <h2>Props</h2>
            <PropTable component="ColorPicker" metadata={Metadata} />
        </div>
    );
}
