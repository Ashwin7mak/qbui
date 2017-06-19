import React from 'react';
import {PropTypes} from 'react';
import AppCreationTable from './appCreationPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {I18nMessage} from "../../utils/i18nMessage";
import * as AppBuilderActions from '../../actions/appBuilderActions';
import Locale from '../../locales/locales';
import _ from 'lodash';

import '../table/tableCreationDialog.scss';

export class AppCreationDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * cancel
     */
    onCancel = () => {
        this.props.hideAppCreationDialog();
    }

    /**
     * last page has finished
     */
    onFinished = () => {
        //Create app here
    };

    /**
     * render the multi-step modal dialog for creating a app
     * @returns {XML}
     */
    render() {

        const classes = ['tableCreationDialog'];

        return (<MultiStepDialog show={this.props.appDialogOpen}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 finishedButtonLabel={Locale.getMessage("appCreation.finishedButtonLabel")}
                                 titles={[Locale.getMessage("appCreation.newAppPageTitle")]}>
            <div className="tableCreationPanel">
                <AppCreationTable />
            </div>
        </MultiStepDialog>);
    }
}

AppCreationDialog.propTypes = {
    hideAppCreationDialog: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    console.log('appCreationDialog: ', state);
    return {
        appDialogOpen: _.get(state.appBuilder, 'dialogOpen')
    };
};

const mapDispatchToProps = {
    hideAppCreationDialog: AppBuilderActions.hideAppCreationDialog
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCreationDialog);
