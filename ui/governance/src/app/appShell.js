import React, {PropTypes, Component} from 'react';
import ReAppShell from '../../../reuse/client/src/components/reAppShell/reAppShell';
import ReDefaultTopNavGlobalActions from '../../../reuse/client/src/components/reTopNav/reDefaultTopNavGlobalActions';
import ReTopNav from '../../../reuse/client/src/components/reTopNav/reTopNav';

const AppShell = ({children}) => (
    <ReAppShell functionalAreaName="governance">
        <ReTopNav title="Governance" globalActions={
            <ReDefaultTopNavGlobalActions
                position="top"
                startTabIndex={4}
                dropdownIcon="user"
                dropdownMsg="globalActions.user"
            />
        }/>
        {children}
    </ReAppShell>
);

export default AppShell;
