import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function IconChooserDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.IconChooser.descHtml}} />

            <ReactPlayground codeText={Examples.IconChooser} />

            <h2>Props</h2>
            <PropTable component="IconChooser" metadata={Metadata} />
        </div>
    );
}
