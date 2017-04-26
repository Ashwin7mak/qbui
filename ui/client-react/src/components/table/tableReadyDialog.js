import React from 'react';
import {PropTypes} from 'react';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {I18nMessage} from "../../utils/i18nMessage";
import Locale from '../../locales/locales';
import * as TableCreationActions from '../../actions/tableCreationActions';
import DnDImage from '../../assets/images/dragdrop_illustration.svg';
import './tableReadyDialog.scss';

export class TableReadyDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * dialog finished
     */
    onFinished = () => {
        this.props.hideTableReadyDialog();
    };

    /**
     * render the modal dialog for creating a table
     * @returns {XML}
     */
    render() {

        return (<MultiStepDialog show={this.props.tableCreation.showTableReadyDialog}
                                 classes="tableReadyDialog"
                                 onFinished={this.onFinished}
                                 onCancel={this.onFinished}
                                 showCancelButton={false}
                                 finishedButtonLabel={Locale.getMessage("tableCreation.tableReadyDialogOK")}>
            <div className="tableReadyContent">
                <div className="topTitle">
                    <div className="dndImage animated zoomIn">
                        <img className="dndSvg" alt="Drag and drop" src={DnDImage} />
                    </div>
                    <div className="titleText">
                        <I18nMessage message="tableCreation.tableReadyTitle"/>
                    </div>
                </div>
                <div className="tableReadyText">
                    <p><I18nMessage message="tableCreation.tableReadyText1"/></p>
                    <p><I18nMessage message="tableCreation.tableReadyText2"/></p>
                </div>
            </div>
        </MultiStepDialog>);
    }
}

TableReadyDialog.propTypes = {
    tableCreation: PropTypes.object.isRequired,
    hideTableReadyDialog: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        tableCreation: state.tableCreation
    };
};

export default connect(
    mapStateToProps,
    TableCreationActions
)(TableReadyDialog);


