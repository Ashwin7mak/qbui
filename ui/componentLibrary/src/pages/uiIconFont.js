import React from 'react';
import IconSwatches from '../components/iconSwatches';


export default function UiIconFontPage() {

    let cssFileContents = require('!raw-loader!../../../reuse/client/src/components/icon/uiIcons.css');
    return (
        <div>
            <h2>UI Icon Font</h2>

            <IconSwatches cssFileContents={cssFileContents}/>
        </div>
    );
}
