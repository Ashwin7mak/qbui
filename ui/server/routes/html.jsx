import React, {PropTypes} from 'react';

var Html = React.createClass({
    propTypes: {
        title   : PropTypes.string,
        lang    : PropTypes.string,
        favicon : PropTypes.string,
        jsPath  : PropTypes.string,
        hostBase: PropTypes.string
    },
    render() {
        return (
            <html lang={this.props.lang}>
                <head>
                    <meta charSet="UTF-8" name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no"/>
                        <title>{this.props.title}</title>

                        <link rel="icon" type="image/png" href={this.props.hostBase + this.props.favicon} />
                        {this.props.styleTagStringContent ? (
                                <style type="text/css">
                                    {this.props.styleTagStringContent}
                                </style>
                        ) : (
                                null)
                        }
                </head>
                <body>
                    {this.props.children}
                </body>
            </html>
        );
    }
});

module.exports = Html;
