import React from 'react';
import {Link} from 'react-router';

var ComponentLibraryWrapper = React.createClass({
    render() {
        return (
            <div className="comp-library">
                <div className="comp-library-nav">
                    <div className="header">
                        <h3 className="title">QuickBase<br />Component Library
                        </h3>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/components/qbpanel" activeClassName="active">QBPanel</Link></li>
                            <li><Link to="/components/qbicon" activeClassName="active">QBIcon</Link></li>
                            <li><Link to="/components/textField" activeClassName="active">TextField</Link></li>
                            <li><Link to="/components/textFieldEditor" activeClassName="active">TextFieldEditor</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="comp-library-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

export default ComponentLibraryWrapper;
