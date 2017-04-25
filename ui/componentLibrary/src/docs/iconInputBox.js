import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function IconInputBoxDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.IconInputBox.descHtml}} />

            <ReactPlayground codeText={Examples.IconInputBox} />

            <h2>Props</h2>
            <PropTable component="IconInputBox" metadata={Metadata} />
        </div>
    );
}
