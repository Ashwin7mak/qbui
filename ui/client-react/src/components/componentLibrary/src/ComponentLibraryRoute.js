import React from 'react';

import QBPanelDoc from '../docs/qbpanel';
import QBIconDoc from '../docs/qbicon';

// var QBIconExample = require('raw!./examples/QBIconExample.js');

/* TODO:
 * 1. DONE Build a big list of examples to import and have it map as an array with route names
 * 2. DONE Get examples working so that they import and render.
 * 3. Dynamically import codeText into ReactPlayground from the `examples` folder.
 * 4. Create a "component description" shortcut component for doing the metadata
 */

 var docs = {
    qbpanel: QBPanelDoc,
    qbicon: QBIconDoc
};

var ComponentRoute = React.createClass({
    render() {
        var DocToRender = docs[this.props.params.componentName];
        return (
            <div className="componentContent">
                <DocToRender />
            </div>
        );
    }
});

export default ComponentRoute;
