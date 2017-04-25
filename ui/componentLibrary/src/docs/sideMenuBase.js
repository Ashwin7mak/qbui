import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function SideMenuBaseDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.SideMenuBase.descHtml}} />

            <ReactPlayground codeText={Examples.SideMenuBase} />

            <h2>Props</h2>
            <PropTable component="SideMenuBase" metadata={Metadata} />
        </div>
    );
}
