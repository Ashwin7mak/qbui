import React, {PropTypes, Component} from "react";
import Stage from "../../../../reuse/client/src/components/stage/stage";
import StageHeader from "../../../../reuse/client/src/components/stage/stageHeader";
import StageHeaderCount from "../../../../reuse/client/src/components/stage/stageHeaderCounts";
import Locale from "../../../../reuse/client/src/locales/locale";
import {connect} from "react-redux";
import {getTotalPaidUsers, getTotalDeniedUsers, getTotalDeactivatedUsers, getTotalRealmUsers} from "./AccountUsersReducer";

import "./AccountUsersStage.scss";

/**
 * The stage for the AccountUsers page
 */
class AccountUsersStage extends Component {

    render() {
        let paidUsers = this.props.paidUsers,
            deniedUsers = this.props.deniedUsers,
            deactivatedUsers = this.props.deactivatedUsers,
            totalRealmUsers = this.props.totalRealmUsers;

        return (
            <Stage stageHeadline={
                <StageHeader
                    title={Locale.getMessage("governance.account.users.stageTitle")}
                    icon="settings"
                    iconClassName="governanceAccountUsersStageIcon"
                    description={
                        <p>
                            {Locale.getMessage("governance.account.users.stageDescription")}
                            <a target="_blank" href={Locale.getMessage('governance.account.users.feedbackLink')}>
                                {Locale.getMessage("governance.account.users.feedbackLinkText")}</a>.
                        </p>
                    }
                />
            }>
                <StageHeaderCount
                    className="governanceStageHeaderItems"
                    stageHeaderHasIcon={true}
                    items={[
                        {count: paidUsers, title: (paidUsers === 1 ? Locale.getMessage("governance.account.users.paidSeatSingular") : Locale.getMessage("governance.account.users.paidSeats"))},
                        {count: deniedUsers, title: (deniedUsers === 1 ? Locale.getMessage("governance.account.users.deniedUserSingular") : Locale.getMessage("governance.account.users.deniedUsers"))},
                        {count: deactivatedUsers, title: (deactivatedUsers === 1 ? Locale.getMessage("governance.account.users.deactivatedUserSingular") : Locale.getMessage("governance.account.users.deactivatedUsers"))},
                        {count: totalRealmUsers, title: Locale.getMessage("governance.account.users.realmDirectoryUsers")},
                    ]}
                />
            </Stage>
        );
    }
}

AccountUsersStage.propTypes = {
    users: PropTypes.array,
};

AccountUsersStage.defaultProps = {
    users: []
};

const mapStateToProps = (state) => {
    return {
        users: state.AccountUsers.users,
        paidUsers: getTotalPaidUsers(state.AccountUsers.users),
        deniedUsers: getTotalDeniedUsers(state.AccountUsers.users),
        deactivatedUsers: getTotalDeactivatedUsers(state.AccountUsers.users),
        totalRealmUsers: getTotalRealmUsers(state.AccountUsers.users)
    };
};

export default connect(mapStateToProps)(AccountUsersStage);
