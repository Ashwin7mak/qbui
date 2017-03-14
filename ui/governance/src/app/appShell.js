import React, {PropTypes, Component} from 'react';
import ReAppShell from '../../../reuse/client/src/components/reAppShell/reAppShell';
import ReDefaultTopNavGlobalActions from '../../../reuse/client/src/components/reTopNav/reDefaultTopNavGlobalActions';
import ReTopNav from '../../../reuse/client/src/components/reTopNav/reTopNav';

class NavShell extends Component {
    render() {
        return (
            <ReAppShell functionalAreaName="governance">
                <ReTopNav title="Governance" globalActions={
                    <ReDefaultTopNavGlobalActions
                        position="top"
                        startTabIndex={4}
                        dropdownIcon="user"
                        dropdownMsg="globalActions.user"
                    />
                }/>
                {this.props.children}
            </ReAppShell>
        );

    }
}

export default NavShell;
