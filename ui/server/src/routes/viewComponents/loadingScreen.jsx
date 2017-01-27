import React from 'react';
import fs from 'fs';
import path from 'path';

var LoadingScreen = React.createClass({
    render() {
        // The loading screen is shared between server and client. Because the server does not use webpack,
        // we need to read the html file in as a string and tell react to render that as html.
        // See more information in common/src/views/readme.md
        var LoadingScreenHtml = fs.readFileSync(path.resolve(__dirname, '../../../../common/src/views/loadingScreen.html'));
        return (<div dangerouslySetInnerHTML={{__html: LoadingScreenHtml}} />);
    }
});

export default LoadingScreen;
