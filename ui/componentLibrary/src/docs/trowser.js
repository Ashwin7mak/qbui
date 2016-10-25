import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function TrowserDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.Trowser.descHtml}} />

            <ReactPlayground codeText={Examples.Trowser} />

            <h2>Props</h2>
            <PropTable component="Trowser" metadata={Metadata} />
        </div>
    );
}
