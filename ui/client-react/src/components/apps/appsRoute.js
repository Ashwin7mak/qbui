import React from 'react';
import PageTitle from '../pageTitle/pageTitle';
import Fluxxor from 'fluxxor';
import AppUtils from '../../utils/appUtils';
import WindowLocationUtils from '../../utils/windowLocationUtils';

let FluxMixin = Fluxxor.FluxMixin(React);

import AppHomePage from '../app/appHomePage';

/**
 * placeholder for my apps route
 */
let AppsRoute = React.createClass({
    mixins: [FluxMixin],

    /**
     * allow access to apps if user has admin access to any of them
     * or any app has openInV3 set or there are no apps
     */
    checkAccess(props) {
        if (this.props.apps && this.props.apps.length > 0 && !props.appsLoading) {
            const hasAnyAdmin = _.find(props.apps, app => AppUtils.hasAdminAccess(app.accessRights));

            if (!hasAnyAdmin) {
                const hasV3 = _.find(props.apps, {openInV3: true});
                if (!hasV3) {
                    WindowLocationUtils.update("/qbase/pageNotFound");
                }
            }
        }
    },
    componentWillReceiveProps(props) {

        this.checkAccess(props);
    },

    componentDidMount() {

        this.checkAccess(this.props);

        // no title for now...
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();

    },

    render() {
        return (
            <div>
                {/* Reset the page title on the apps page to the realm */}
                <PageTitle />
                <AppHomePage />
            </div>
        );
    }
});

export default AppsRoute;
