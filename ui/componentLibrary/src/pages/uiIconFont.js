import React from 'react';
import IconSwatches from '../components/iconSwatches';


export default function UiIconFontPage() {

    let cssFileContents = require('!raw-loader!../../../reuse/client/src/components/icon/uiIcons.css');
    return (
        <div>
            <h2>Icon Font: UI Sturdy</h2>

            <p>Each icon clearly communicates the task for which it solves.
                When applied consistently, icons enable our customers to quickly
                complete a task (examples: delete an item, attach a file).
                Icons should never be used as decoration, and should always
                correspond to an action.</p>

            <p>This is the Sturdy variant of this font. It has a chunky, bold, thick style.</p>

            <IconSwatches cssFileContents={cssFileContents}/>
        </div>
    );
}
