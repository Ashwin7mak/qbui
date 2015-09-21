import React from 'react';
import ReactIntl from 'react-intl';
import './footer.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Footer = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        var currentYear = new Date().getFullYear();
        return <footer className="layout-footer">
            <span className="layout-footer-content">
              &#169;<FormattedMessage message={this.getIntlMessage('footer.copyright')} year={currentYear} />
            </span>
        </footer>
    }
});

/*
class Footer extends React.Component {

    render() {

        var currentYear = new Date().getFullYear();

        return <footer className="layout-footer">
                 <span className="layout-footer-content">&#169;{currentYear} Intuit Inc. All rights reserved.</span>
               </footer>
    }
}
*/
export default Footer;