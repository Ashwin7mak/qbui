import React, {PropTypes, Component} from 'react';
import AppShell from '../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/topNav/topNav';

const GovernanceAppShell = ({children}) => (
    <AppShell functionalAreaName="governance">
        <TopNav title="Governance" globalActions={
            <DefaultTopNavGlobalActions
                position="top"
                startTabIndex={4}
                dropdownIcon="user"
                dropdownMsg="globalActions.user"
            />
        }/>
        {children}
    </AppShell>
);

export default GovernanceAppShell;
