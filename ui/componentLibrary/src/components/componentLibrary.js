import React from 'react';
import {Link, Switch} from 'react-router-dom';
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";

var ComponentLibraryWrapper = React.createClass({
    render() {
        return (
            <div className="comp-library">
                <div className="comp-library-nav">
                    <div className="header">
                        <h3 className="title">
                            QuickBase<br />Engineering
                        </h3>
                    </div>
                    <nav>
                        <h4 className="header">Design System</h4>
                        <ul>
                            <li><Link to="/qbase/components/home" activeClassName="active">Home</Link></li>
                            <li><Link to="/qbase/components/colors" activeClassName="active">Colors</Link></li>
                            <li><Link to="/qbase/components/uiIconFont" activeClassName="active">UI Icon Font</Link></li>
                            <li><Link to="/qbase/components/tableIconFont" activeClassName="active">Table Icon Font</Link></li>
                        </ul>
                        <h4 className="header">Reuse Library Components</h4>
                        <ul>
                            <li><Link to="/qbase/components/colorPicker" activeClassName="active">ColorPicker</Link></li>
                            <li><Link to="/qbase/components/icon" activeClassName="active">Icon</Link></li>
                            <li><Link to="/qbase/components/iconChooser" activeClassName="active">IconChooser</Link></li>
                            <li><Link to="/qbase/components/iconInputBox" activeClassName="active">IconInputBox</Link></li>
                            <li><Link to="/qbase/components/pageTitle" activeClassName="active">PageTitle</Link></li>
                            <li><Link to="/qbase/components/pagination" activeClassName="active">Pagination</Link></li>
                            {/* <li><Link to="/qbase/components/rowActions" activeClassName="active">RowActions</Link></li> */}
                            <li><Link to="/qbase/components/sideMenuBase" activeClassName="active">SideMenuBase</Link></li>
                            <li><Link to="/qbase/components/sideTrowserBase" activeClassName="active">SideTrowserBase</Link></li>
                            <li><Link to="/qbase/components/simpleInput" activeClassName="active">SimpleInput</Link></li>
                            <li><Link to="/qbase/components/stage" activeClassName="active">Stage</Link></li>
                            <li><Link to="/qbase/components/standardGridItemsCount" activeClassName="active">StandardGridItemsCount</Link></li>
                            <li><Link to="/qbase/components/standardLeftNav" activeClassName="active">StandardLeftNav</Link></li>
                            <li><Link to="/qbase/components/tooltip" activeClassName="active">Tooltip</Link></li>
                            <li><Link to="/qbase/components/topNav" activeClassName="active">TopNav</Link></li>
                        </ul>
                        <h4 className="header">Reuse Library Utilities</h4>
                        <ul>
                        <li><Link to="/qbase/components/notificationManager" activeClassName="active">NotificationManager</Link></li>
                        </ul>
                        <h4 className="header">Field Components</h4>
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
                            <li><Link to="/qbase/components/qbpanel" activeClassName="active">QBPanel</Link></li>
                            <li><Link to="/qbase/components/trowser" activeClassName="active">Trowser</Link></li>
                            <li><Link to="/qbase/components/qBModal" activeClassName="active">QBModal</Link></li>
                            <li><Link to="/qbase/components/invisibleBackdrop" activeClassName="active">InvisibleBackdrop</Link></li>
                            <li><Link to="/qbase/components/qbGrid" activeClassName="active">QbGrid</Link></li>
                            <li><Link to="/qbase/components/qbLoader" activeClassName="active">QbLoader</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="comp-library-content">
                    <Switch>
                        { this.props.routes !== undefined ? this.props.routes.map((route, i) => {
                            return (
                                RouteWithSubRoutes(route, i)
                            );
                        }) : ''}
                    </Switch>
                </div>
            </div>
        );
    }
});

export default ComponentLibraryWrapper;
