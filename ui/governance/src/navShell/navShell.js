import React, {PropTypes, Component} from 'react';
import TopNav from '../../../reuse/client/src/components/reTopNav/reTopNav';


class NavShell extends Component {
    render() {
        return (
            <div className="governanceShell">
                <TopNav title="Governance" />
                {this.props.children}
            </div>
        );

    }
}

export default NavShell;
