var React = require('react');
var Html = require('./html');

var Index = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        jsPath: React.PropTypes.string
    },
    render: function() {
        console.log(" Index props = "+ JSON.stringify(this.props));
        return (
            <Html {...this.props}>
                <div id="content">
                </div>

                <script src={this.props.hostBase + this.props.jsPath + 'bundle.js'}></script>
            </Html>
        );
    }
});
module.exports = Index;
