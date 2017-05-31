import React from 'react';
import PageTitle from '../pageTitle/pageTitle';
import Fluxxor from 'fluxxor';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import Locale from '../../locales/locales';
import MyAppsPage from './myAppsPage';
import {connect} from 'react-redux';

let FluxMixin = Fluxxor.FluxMixin(React);

import {setTopTitle, showTopNav} from '../../actions/shellActions';

/**
 * placeholder for my apps route
 */
let AppsRoute = React.createClass({
    mixins: [FluxMixin],

    componentDidMount() {
        // no title for now...
        this.props.showTopNav();
        this.props.setTopTitle();

    },

    getStageHeadline() {
        const userHeadLine = `${Locale.getMessage('app.homepage.welcomeTitle')} Mercury`;
        return (
            <div className="appHomePageStage">
                <div className="appStageHeadline">
                    <h3 className="appHeadLine">{userHeadLine}</h3>
                </div>
            </div>);
    },

    render() {
        return (
            <div className="appHomePageContainer">
                {/* Reset the page title on the apps page to the realm */}
                <PageTitle />
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={null}>
                    <div></div>
                </Stage>
                <MyAppsPage />
            </div>
        );
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setTopTitle: (title) => dispatch(setTopTitle(title)),
        showTopNav: () => dispatch(showTopNav())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppsRoute);
