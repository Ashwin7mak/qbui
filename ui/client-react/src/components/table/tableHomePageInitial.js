import React from 'react';
import {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import {I18nMessage} from "../../utils/i18nMessage";
import './tableHomePageInitial.scss';

/**
 * initial table homepage displayed when a new table is created (until session expires or rows are created)
 */
class TableHomePageInitial extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * render the table settings UI
     * @returns {XML}
     */
    render() {

        return (
            <div className="tableHomePageInitial">
                <div className="iconWrapper">
                    <div className="starShape animated rubberBand">
                        <div className="starShapeContent">
                           <Icon icon={_.has(this.props, "selectedTable.tableIcon") ? this.props.selectedTable.tableIcon : "projects"} iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}/>
                        </div>
                    </div>
                </div>
                <div className="h1 animated fadeIn"><I18nMessage message="tableCreation.homePageInitialTitle"/></div>

                <div className="description"><I18nMessage message="tableCreation.homePageInitialDescription"/></div>

                <Button className="addRecordButton" onClick={this.props.onAddRecord}>
                    <Icon icon="add-mini"/>
                    <I18nMessage message="tableCreation.homePageAddRecordButton"/>
                </Button>

                <div className="moreOptions">
                    <I18nMessage message="tableCreation.homePageStillBuilding"/>&nbsp;
                    <a href="#" onClick={this.props.onCreateTable}><I18nMessage message="tableCreation.homePageCreateAnother"/></a>
                </div>
            </div>);
    }
}

TableHomePageInitial.PropTypes = {
    /**
     * selected table object containing tableIcon property
     */
    selectedTable: PropTypes.obj,

    /**
     * create another table callback
     */
    onCreateTable: PropTypes.func,

    /**
     * add new record callback
     */
    onAddRecord: PropTypes.func
};

export default TableHomePageInitial;
