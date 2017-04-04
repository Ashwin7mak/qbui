import React from 'react';
import ColorSwatches from '../components/colorSwatches';


export default function ColorsPage() {

    let scssFileContents = require('!raw-loader!../../../reuse/client/src/assets/css/_qbColorPalette-QuickBase3.scss');
    return (
        <div>
            <h2>Colors</h2>

            <ColorSwatches scssFileContents={scssFileContents}/>
        </div>
    );
}
