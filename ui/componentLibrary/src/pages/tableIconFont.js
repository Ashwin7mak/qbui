import React from 'react';
import IconSwatches from '../components/iconSwatches';


export default function TableIconFontPage() {

    let cssFileContents = require('!raw-loader!../../../reuse/client/src/components/icon/tableIcons.css');
    return (
        <div>
            <h2>Table Icon Font</h2>

            <IconSwatches cssFileContents={cssFileContents}/>
        </div>
    );
}
