import React, {PropTypes, Component} from 'react';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import StageHeader from '../../../../reuse/client/src/components/stage/stageHeader';
import StageHeaderCount from '../../../../reuse/client/src/components/stage/stageHeaderCounts';
import {I18nMessage} from '../../../../reuse/client/src/utils/i18nMessage';
import Locale from '../../../../reuse/client/src/locales/locale';
/**
 * The stage for the AccountUsers page
 * TODO:: Replace mocked data with data from API calls.
 * TODO:: Localize strings once Localization story is complete: https://quickbase.atlassian.net/browse/MC-1125
 * @param isHidden
 * @constructor
 */
const AccountUsersStage = (isHidden) => (
    <Stage stageHeadline={
        <StageHeader
            title={Locale.getMessage("governance.account.users.stageTitle")}
            icon="settings"
            iconClassName="governanceAccountUsersStageIcon"
            description={
                <p>
                    <I18nMessage message="governance.account.users.stageDescription"/> <a href="#"><I18nMessage message="governance.account.users.feedbackLinkText"/></a>
                </p>
            }
        />
    }>
        {isHidden ? null :
        <StageHeaderCount
            className="governanceStageHeaderItems"
            stageHeaderHasIcon={true}
            items={[
                {count: '25', title: 'Paid seats'},
                {count: '10', title: 'Denied users'},
                {count: '3', title: 'Deactivated users'},
                {count: '42', title: 'In realm directory'},
            ]}
        />}
    </Stage>
);

AccountUsersStage.propTypes = {
    /**
     * A temporary prop to hide the stage while it is being developed */
    isHidden: PropTypes.bool
};

export default AccountUsersStage;
