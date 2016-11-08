import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function AlertBannerDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.AlertBanner.descHtml}} />

            <ReactPlayground codeText={Examples.AlertBanner} />

            <h2>Props</h2>
            <PropTable component="AlertBanner" metadata={Metadata} />
        </div>
    );
}
