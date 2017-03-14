import React, {PropTypes, Component} from 'react';
import ReGlobalAction from '../reGlobalAction/reGlobalAction';
import UserDropDown from './supportingComponents/userDropDown';
import ReHelpButton from '../reHelpButton/reHelpButton';

// IMPORTING FROM CLIENT REACT
// Needs to be refactored once these components are added to the reuse library
import Locale from '../../../../../client-react/src/locales/locales';
import WindowLocationUtils from '../../../../../client-react/src/utils/windowLocationUtils';
// IMPORTING FROM CLIENT REACT

const signOutHref = '/qbase/signout';

/**
 * The default global actions that are consistent across functional areas of the qbase app ecosystem.
 * This only includes the actions and is not the full top nav bar. Use ReTopNav bar with this component passed in as the GlobalActions.
 * You can pass in additional actions by passing in an array of action objects to the `actions` prop.
 * Alternatively, pass in additional top bar elements by wrapping them with this component as children: <ReDefaultTopNavGlobalActions> <div>CustomMenuItem</div> </ReDefaultTopNavGlobalActions>
 * Check out the propTypes for other values you can change if you need.
 * If these default actions don't suit your needs, try creating a custom top nav by using the ReTopNav with an array of GlobalAction components */
class ReDefaultTopNavGlobalActions extends Component {
    constructor(props) {
        super(props);

        this.changeLocale = this.changeLocale.bind(this);
    }

    /**
     * Fires the changeLocale callback when the user selects a language from the User dropdown
     * @param locale
     */
    changeLocale(locale) {
        if (this.props.changeLocale) {
            this.props.changeLocale(locale);
        }
    }

    /**
     * A link to sign the user out
     * (MenuItem href is currently incompatible with react-fastclick) */
    signOutUser() {
        WindowLocationUtils.update(signOutHref);
    }

    render() {
        return (
            <div className={"globalActions"}>
                <ul className={"globalActionsList"}>
                    {this.props.children}
                    {this.props.actions && this.props.actions.map((action, index) => (
                        <ReGlobalAction
                            tabIndex={this.props.startTabIndex + index}
                            key={action.msg}
                            linkClass={this.props.linkClass}
                            onSelect={this.props.onSelect}
                            action={action}
                        />
                    ))}
                    <li className={"link globalAction withDropdown"}>
                        <UserDropDown
                            supportedLocales={Locale.getSupportedLocales()}
                            changeLocale={this.changeLocale}
                            startTabIndex={this.props.startTabIndex + this.props.actions.length}
                            signOutUser={this.signOutUser}
                            app={this.props.app}
                        />
                    </li>
                    <li className={"link globalAction"}><ReHelpButton/></li>
                </ul>
            </div>
        );
    }
}

const actionPropType = React.PropTypes.shape({
    icon: React.PropTypes.string.isRequired,
    msg: React.PropTypes.string.isRequired,
    link: React.PropTypes.string
});

ReDefaultTopNavGlobalActions.propTypes = {
    linkClass: PropTypes.string,
    onSelect: PropTypes.func,
    position: PropTypes.string,
    actions: PropTypes.arrayOf(actionPropType),
    startTabIndex: PropTypes.number,
    app: PropTypes.object,

    changeLocale: React.PropTypes.func,
};

ReDefaultTopNavGlobalActions.defaultProps = {
    position: 'bottom',
    startTabIndex: 0,
    actions: [],
};

export default ReDefaultTopNavGlobalActions;
