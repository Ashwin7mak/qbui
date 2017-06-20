import React from 'react';
import {PropTypes} from 'react';
import AppCreationTable from './appCreationPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import * as AppBuilderActions from '../../actions/appBuilderActions';
import * as AppBuilderSelectors from '../../reducers/appBuilder';
import Locale from '../../locales/locales';
import _ from 'lodash';

import '../../../../reuse/client/src/components/multiStepDialog/creationDialog.scss';

export class AppCreationDialog extends React.Component {
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
        //This is the button that creates the app here
    };

    /**
     * render the multi-step modal dialog for creating a app
     * @returns {XML}
     */
    render() {

        const classes = ['appCreationDialog creationDialog'];

        return (<MultiStepDialog show={this.props.appDialogOpen}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 finishedButtonLabel={Locale.getMessage("appCreation.finishedButtonLabel")}
                                 titles={[Locale.getMessage("appCreation.newAppPageTitle")]}>
            <div className="dialogCreationPanel">
                <AppCreationTable />
            </div>
        </MultiStepDialog>);
    }
}

AppCreationDialog.propTypes = {
    hideAppCreationDialog: PropTypes.func.isRequired,
    appDialogOpen: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        appDialogOpen: AppBuilderSelectors.getIsDialogOpenState(state)
    };
};

const mapDispatchToProps = {
    hideAppCreationDialog: AppBuilderActions.hideAppCreationDialog
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCreationDialog);
