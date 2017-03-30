import React from 'react';
import ColorSwatches from '../components/colorSwatches';


export default function Colors2Page() {

    let scssFileContents = require('!raw-loader!../../../reuse/client/src/assets/css/_qbColorPalette-QuickBase2.scss');
    return (
        <div>
            <h2>Colors 2</h2>

            <ColorSwatches scssFileContents={scssFileContents}/>
        </div>
    );
}
