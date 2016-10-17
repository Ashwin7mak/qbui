import React from 'react';
import {Link} from 'react-router';

var ComponentLibraryWrapper = React.createClass({
    render() {
        return (
            <div className="comp-library">
                <div className="comp-library-nav">
                    <div className="header">
                        <h3 className="title">
                            QuickBase<br />Component Library
                        </h3>
                    </div>
                    <nav>
                        <h4 className="header">Fields</h4>
                        <ul>
                            <li><Link to="/components/checkBoxFieldValueEditor" activeClassName="active">CheckBoxFieldValueEditor</Link></li>
                            <li><Link to="/components/checkBoxFieldValueRenderer" activeClassName="active">CheckBoxFieldValueRenderer</Link></li>
                            <li><Link to="/components/dateFieldValueEditor" activeClassName="active">DateFieldValueEditor</Link></li>
                            <li><Link to="/components/dateTimeFieldValueEditor" activeClassName="active">DateTimeFieldValueEditor</Link></li>
                            <li><Link to="/components/dateTimeFieldValueRenderer" activeClassName="active">DateTimeFieldValueRenderer</Link></li>
                            <li><Link to="/components/emailFieldValueEditor" activeClassName="active">EmailFieldValueEditor</Link></li>
                            <li><Link to="/components/emailFieldValueRenderer" activeClassName="active">EmailFieldValueRenderer</Link></li>
                            <li><Link to="/components/fieldValueEditor" activeClassName="active">FieldValueEditor</Link></li>
                            <li><Link to="/components/fieldValueRenderer" activeClassName="active">FieldValueRenderer</Link></li>
                            <li><Link to="/components/multiChoiceFieldValueEditor" activeClassName="active">MultiChoiceFieldValueEditor</Link></li>
                            <li><Link to="/components/multiLineTextFieldValueEditor" activeClassName="active">MultiLineTextFieldValueEditor</Link></li>
                            <li><Link to="/components/numericFieldValueEditor" activeClassName="active">NumericFieldValueEditor</Link></li>
                            <li><Link to="/components/numericFieldValueRenderer" activeClassName="active">NumericFieldValueRenderer</Link></li>
                            <li><Link to="/components/textFieldValueEditor" activeClassName="active">TextFieldValueEditor</Link></li>
                            <li><Link to="/components/textFieldValueRenderer" activeClassName="active">TextFieldValueRenderer</Link></li>
                            <li><Link to="/components/timeFieldValueEditor" activeClassName="active">TimeFieldValueEditor</Link></li>
                            <li><Link to="/components/timeFieldValueRenderer" activeClassName="active">TimeFieldValueRenderer</Link></li>
                            <li><Link to="/components/urlFieldValueEditor" activeClassName="active">UrlFieldValueEditor</Link></li>
                            <li><Link to="/components/urlFieldValueRenderer" activeClassName="active">UrlFieldValueRenderer</Link></li>
                            <li><Link to="/components/userFieldEditor" activeClassName="active">UserFieldEditor</Link></li>
                            <li><Link to="/components/userFieldRenderer" activeClassName="active">UserFieldRenderer</Link></li>
                        </ul>
                        <h4 className="header">Generic Components</h4>
                        <ul>
                            <li><Link to="/components/qbpanel" activeClassName="active">QBPanel</Link></li>
                            <li><Link to="/components/qbicon" activeClassName="active">QBIcon</Link></li>
                            <li><Link to="/components/trowser" activeClassName="active">Trowser</Link></li>
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
