import React from 'react';

import Metadata from '../components/Metadata';
import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';
import PropTable from '../components/PropTable';

export default function PaginationDoc() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: Metadata.Pagination.descHtml}} />

            <ReactPlayground codeText={Examples.Pagination} />

            <h2>Props</h2>
            <PropTable component="Pagination" metadata={Metadata} />
        </div>
    );
}
