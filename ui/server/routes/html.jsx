var React = require('react');

var Html = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        lang: React.PropTypes.string,
        favicon: React.PropTypes.string,
        jsPath: React.PropTypes.string,
        hostBase: React.PropTypes.string
      },
    render: function() {
        console.log(" HTML props = "+ JSON.stringify(this.props));

        return (
            <html lang={this.props.lang}>
                <head>
                    <meta charSet="UTF-8" />
                        <title>{this.props.title}</title>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
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
