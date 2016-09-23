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
                            <li><Link to="/components/textFieldValueRenderer" activeClassName="active">TextFieldValueRenderer</Link></li>
                            <li><Link to="/components/textFieldValueEditor" activeClassName="active">TextFieldValueEditor</Link></li>
                            <li><Link to="/components/numericFieldValueRenderer" activeClassName="active">NumericFieldValueRenderer</Link></li>
                            <li><Link to="/components/numericFieldValueEditor" activeClassName="active">NumericFieldValueEditor</Link></li>
                            <li><Link to="/components/fieldValueRenderer" activeClassName="active">FieldValueRenderer</Link></li>
                            <li><Link to="/components/fieldValueEditor" activeClassName="active">FieldValueEditor</Link></li>
                            <li><Link to="/components/userFieldRenderer" activeClassName="active">UserFieldRenderer</Link></li>
                            <li><Link to="/components/userFieldEditor" activeClassName="active">UserFieldEditor</Link></li>
                            <li><Link to="/components/multiLineTextFieldValueEditor" activeClassName="active">MultiLineTextFieldValueEditor</Link></li>
                            <li><Link to="/components/multiChoiceFieldValueEditor" activeClassName="active">MultiChoiceFieldValueEditor</Link></li>
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
