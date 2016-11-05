import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import CreateInQuickBaseClassicMessage from '../../src/components/nav/createInQuickBaseClassicMessage';

let component;
let testAppId = '1234';

describe('CreateInQuickBaseClassicMessage', () => {
    it('displays a message for no tables', () => {
        component = TestUtils.renderIntoDocument(<CreateInQuickBaseClassicMessage nameOfElements="tables" selectedAppId={testAppId} />);

        TestUtils.findRenderedDOMComponentWithClass(component, 'noTables');
    });

    it('displays a message for no apps', () => {
        component = TestUtils.renderIntoDocument(<CreateInQuickBaseClassicMessage nameOfElements="apps" selectedAppId={testAppId} />);

        TestUtils.findRenderedDOMComponentWithClass(component, 'noApps');
    });

    it('has a link for opening the app in QuickBase classic', () => {
        component = TestUtils.renderIntoDocument(<CreateInQuickBaseClassicMessage nameOfElements="tables" selectedAppId={testAppId} />);

        let link = TestUtils.findRenderedDOMComponentWithClass(component, 'quickBaseClassicLink');

        expect(link.href).toContain(testAppId);
    });
});
