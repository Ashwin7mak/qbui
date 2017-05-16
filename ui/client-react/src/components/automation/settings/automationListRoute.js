import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import Loader from 'react-loader';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../../reuse/client/src/components/icon/icon.js';
import QBModal from '../../qbModal/qbModal';
import {loadAutomations} from '../../../actions/automationActions';
import _ from 'lodash';

import './automationList.scss';
import {CONTEXT} from '../../../actions/context';


export const AutomationListRoute = React.createClass({

    getInitialState() {
        return {
            confirmInputValue: ""
        };
    },
    getExistingAutomationNames() {
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    getStageHeadline() {
        return <div className="automationListSettingsStage stageHeadLine"><I18nMessage message={"settings.automationSettings"}/></div>;
    },
    componentDidMount() {
        if (this.props.app) {
            this.props.loadAutomations(CONTEXT.AUTOMATION.GRID, this.props.app.id)
        }
    },
    componentWillReceiveProps(nextProps) {
    },
    renderAutomations() {
        if (this.props.automations && this.props.automations.length > 0) {
            return this.props.automations.map((automation, index) => (
                <li>{automation.name}</li>
            ));
        }
        return [];
    },
    render() {
        let loaded = !(_.isUndefined(this.props.app) || _.isUndefined(this.props.automations));
        let names = this.renderAutomations();
        return <Loader loaded={loaded}>
            <div>
                <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

                <h1 className="automationListMessage">
                    Here is a list of your automations for this app:
                </h1>
                <ul className="automationListNames">
                    {names}
                </ul>
            </div>
        </Loader>;
    }
});

const mapStateToProps = (state) => {
    return {
        isDirty: false,
        automations : state.automation.list
    };
};

const mapDispatchToProps = {
    loadAutomations
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationListRoute);
