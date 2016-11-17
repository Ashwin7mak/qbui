import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function PageTitleDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.PageTitle.descHtml}} />

            <ReactPlayground codeText={Examples.PageTitle} />

            <h2>Props</h2>
            <PropTable component="PageTitle" metadata={Metadata} />
        </div>
    );
}
