import React, {PropTypes, Component} from 'react';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import StageHeader from '../../../../reuse/client/src/components/stage/stageHeader';
import StageHeaderCount from '../../../../reuse/client/src/components/stage/stageHeaderCounts';

/**
 * The stage for the AccountUsers page
 * TODO:: Replace mocked data with data from API calls.
 * TODO:: Localize strings once Localization story is complete: https://quickbase.atlassian.net/browse/MC-1125
 * @param isHidden
 * @constructor
 */
const AccountUsersStage = ({isHidden}) => (
    isHidden ?
        null :
        <Stage stageHeadline={
            <StageHeader
                title="Manage All Users"
                icon="users"
                iconClassName="governanceAccountUsersStageIcon"
                description={
                    <p>
                        Use this page to manage QuickBase users at the account and realm levels. Take a look around and try out the functionality.
                        If you have any feedback, we'd love to hear it: <a href="#">https://some.quickbase.com/link/to/feedback</a>
                    </p>
                }
            />
        }>
            <StageHeaderCount
                className="governanceStageHeaderItems"
                stageHeaderHasIcon={true}
                items={[
                    {count: '25', title: 'Paid seats'},
                    {count: '10', title: 'Denied users'},
                    {count: '3', title: 'Deactivated users'},
                    {count: '42', title: 'In realm directory'},
                ]}
            />
        </Stage>
);

AccountUsersStage.propTypes = {
    /**
     * A temporary prop to hide the stage while it is being developed */
    isHidden: PropTypes.bool
};

export default AccountUsersStage;
