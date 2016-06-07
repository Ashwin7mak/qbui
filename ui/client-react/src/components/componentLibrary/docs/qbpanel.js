import React from 'react';

import metadata from '../src/Metadata'; // push into examples
import ReactPlayground from '../src/ReactPlayground'; // push into examples
import PropTable from '../src/PropTable'; // push into examples
import QBPanel from '../../QBPanel/qbpanel';

export default function QBPanelDoc() {
  return (
    <div className="componentContent">
        <div dangerouslySetInnerHTML={{__html: metadata.QBPanel.descHtml}} />

        <ReactPlayground codeText="const basicIcon = (<QBPanel />); ReactDOM.render(basicIcon, mountNode);"/>

        <h2>Props</h2>
        <PropTable component="QBPanel" metadata={metadata} />
    </div>
  );
}
