import React, {PropTypes, Component} from 'react';
import ReDefaultTopNavGlobalActions from '../../../reuse/client/src/components/reTopNav/reDefaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/reTopNav/reTopNav';


class NavShell extends Component {
    render() {
        return (
            <div className="governanceShell">
                <TopNav title="Governance" globalActions={
                    <ReDefaultTopNavGlobalActions
                        position="top"
                        startTabIndex={4}
                        dropdownIcon="user"
                        dropdownMsg="globalActions.user"
                        app={null}
                    />
                }/>
                {this.props.children}
            </div>
        );

    }
}

export default NavShell;
