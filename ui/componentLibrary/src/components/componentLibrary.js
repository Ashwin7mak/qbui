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
                            <li><Link to="/qbase/components/checkBoxFieldValueEditor" activeClassName="active">CheckBoxFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/checkBoxFieldValueRenderer" activeClassName="active">CheckBoxFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/dateFieldValueEditor" activeClassName="active">DateFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/dateTimeFieldValueEditor" activeClassName="active">DateTimeFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/dateTimeFieldValueRenderer" activeClassName="active">DateTimeFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/durationFieldValueEditor" activeClassName="active">DurationFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/durationFieldValueRenderer" activeClassName="active">DurationFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/emailFieldValueEditor" activeClassName="active">EmailFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/emailFieldValueRenderer" activeClassName="active">EmailFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/fieldValueEditor" activeClassName="active">FieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/fieldValueRenderer" activeClassName="active">FieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/multiChoiceFieldValueEditor" activeClassName="active">MultiChoiceFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/multiLineTextFieldValueEditor" activeClassName="active">MultiLineTextFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/numericFieldValueEditor" activeClassName="active">NumericFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/numericFieldValueRenderer" activeClassName="active">NumericFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/phoneFieldValueEditor" activeClassName="active">PhoneFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/phoneFieldValueRenderer" activeClassName="active">PhoneFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/textFieldValueEditor" activeClassName="active">TextFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/textFieldValueRenderer" activeClassName="active">TextFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/timeFieldValueEditor" activeClassName="active">TimeFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/timeFieldValueRenderer" activeClassName="active">TimeFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/urlFieldValueEditor" activeClassName="active">UrlFieldValueEditor</Link></li>
                            <li><Link to="/qbase/components/urlFieldValueRenderer" activeClassName="active">UrlFieldValueRenderer</Link></li>
                            <li><Link to="/qbase/components/userFieldEditor" activeClassName="active">UserFieldEditor</Link></li>
                            <li><Link to="/qbase/components/userFieldRenderer" activeClassName="active">UserFieldRenderer</Link></li>
                        </ul>
                        <h4 className="header">Generic Components</h4>
                        <ul>
                            <li><Link to="/qbase/components/alertBanner" activeClassName="active">AlertBanner</Link></li>
                            <li><Link to="/qbase/components/pageTitle" activeClassName="active">PageTitle</Link></li>
                            <li><Link to="/qbase/components/qbpanel" activeClassName="active">QBPanel</Link></li>
                            <li><Link to="/qbase/components/icon" activeClassName="active">Icon</Link></li>
                            <li><Link to="/qbase/components/trowser" activeClassName="active">Trowser</Link></li>
                            <li><Link to="/qbase/components/qBModal" activeClassName="active">QBModal</Link></li>
                            <li><Link to="/qbase/components/invisibleBackdrop" activeClassName="active">InvisibleBackdrop</Link></li>
                            <li><Link to="/qbase/components/qbGrid" activeClassName="active">QbGrid</Link></li>
                            <li><Link to="/qbase/components/sideMenuBase" activeClassName="active">SideMenuBase</Link></li>
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
