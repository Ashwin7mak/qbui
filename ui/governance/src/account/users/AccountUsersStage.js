import React, {PropTypes, Component} from "react";
import Stage from "../../../../reuse/client/src/components/stage/stage";
import StageHeader from "../../../../reuse/client/src/components/stage/stageHeader";
import StageHeaderCount from "../../../../reuse/client/src/components/stage/stageHeaderCounts";
import Locale from "../../../../reuse/client/src/locales/locale";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import lodash from "lodash";

import "./AccountUsersStage.scss";

/**
 * The stage for the AccountUsers page
 */
class AccountUsersStage extends Component {

    /**
     * Paid users are any users that have access to the app and are not internal Quick Base users
     * @returns {*}
     */
    getTotalPaidUsers() {
        return lodash.sumBy(this.props.users, user =>  (
            user.hasAppAccess && !RealmUserAccountFlagConstants.HasAnySystemPermissions(user) && !RealmUserAccountFlagConstants.IsDenied(user) && !RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0));
    }

    getTotalDeniedUsers() {
        return lodash.sumBy(this.props.users, user =>  (RealmUserAccountFlagConstants.IsDenied(user) ? 1 : 0));
    }

    getTotalDeactivatedUsers() {
        return lodash.sumBy(this.props.users, user =>  (RealmUserAccountFlagConstants.IsDeactivated(user) ? 1 : 0));
    }

    getTotalRealmUsers() {
        return lodash.sumBy(this.props.users, user =>  (user.realmDirectoryFlags !== 0 ? 1 : 0));
    }

    render() {
        let paidUsers = this.getTotalPaidUsers(),
            deniedUsers = this.getTotalDeniedUsers(),
            deactivatedUsers = this.getTotalDeactivatedUsers();

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
                        {count: this.getTotalRealmUsers(), title: Locale.getMessage("governance.account.users.realmDirectoryUsers")},
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

export default AccountUsersStage;
