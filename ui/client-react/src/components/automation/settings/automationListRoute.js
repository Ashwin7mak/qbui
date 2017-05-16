import React from 'react';
import {Button, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import Loader from 'react-loader';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../../reuse/client/src/components/icon/icon.js';
import QBModal from '../../qbModal/qbModal';
import QBPanel from '../../QBPanel/qbpanel.js';
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
            this.props.loadAutomations(CONTEXT.AUTOMATION.GRID, this.props.app.id);
        }
    },
    componentWillReceiveProps(nextProps) {
    },
    renderAutomations() {
        if (this.props.automations && this.props.automations.length > 0) {
            return this.props.automations.map((automation, index) => (
                <tr><td>{automation.name}</td></tr>
            ));
        }
        return [];
    },
    render() {
        let loaded = !(_.isUndefined(this.props.app) || _.isUndefined(this.props.automations));
        let names = this.renderAutomations();
        return <Loader loaded={loaded}>
            <div className="automationSettings">
                <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

                <div className="automationSettings--container">
                    <Table hover className="automationSettings--table">
                      <thead>
                        <tr>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {names}
                      </tbody>
                    </Table>
                </div>
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
