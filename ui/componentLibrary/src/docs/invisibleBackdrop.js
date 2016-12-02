import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function InvisibleBackdropDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.InvisibleBackdrop.descHtml}} />

            <ReactPlayground codeText={Examples.InvisibleBackdrop} />

            <h2>Props</h2>
            <PropTable component="InvisibleBackdrop" metadata={Metadata} />
        </div>
    );
}
