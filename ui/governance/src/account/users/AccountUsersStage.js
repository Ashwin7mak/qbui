import React, {PropTypes, Component} from "react";
import Stage from "../../../../reuse/client/src/components/stage/stage";
import StageHeader from "../../../../reuse/client/src/components/stage/stageHeader";
import StageHeaderCount from "../../../../reuse/client/src/components/stage/stageHeaderCounts";
import {I18nMessage} from "../../../../reuse/client/src/utils/i18nMessage";
import Locale from "../../../../reuse/client/src/locales/locale";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import lodash from 'lodash';

/**
 * The stage for the AccountUsers page
 */
class AccountUsersStage extends React.Component {

    constructor(...args) {
        super(...args);
    }

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
        return (
            <Stage stageHeadline={
                <StageHeader
                    title={Locale.getMessage("governance.account.users.stageTitle")}
                    icon="users"
                    iconClassName="governanceAccountUsersStageIcon"
                    description={
                        <p>
                            <I18nMessage message="governance.account.users.stageDescription"/> <a href="#"><I18nMessage
                            message="governance.account.users.feedbackLinkText"/></a>
                        </p>
                    }
                />
            }>
                <StageHeaderCount
                    className="governanceStageHeaderItems"
                    stageHeaderHasIcon={true}
                    items={[
                        {count: this.getTotalPaidUsers(), title: Locale.getMessage("governance.account.users.paidSeats")},
                        {count: this.getTotalDeniedUsers(), title: Locale.getMessage("governance.account.users.deniedUsers")},
                        {count: this.getTotalDeactivatedUsers(), title: Locale.getMessage("governance.account.users.deactivatedUsers")},
                        {count: this.getTotalRealmUsers(), title: Locale.getMessage("governance.account.users.realmDirectoryUsers")},
                    ]}
                />
            </Stage>
        );
    }
}

AccountUsersStage.defaultProps = {
    users: []
};

AccountUsersStage.propTypes = {
    users: PropTypes.array,
};

export default AccountUsersStage;
