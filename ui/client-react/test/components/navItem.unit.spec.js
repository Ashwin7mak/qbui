import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import {AVAILABLE_ICON_FONTS} from '../../../reuse/client/src/components/icon/icon.js';
import {Link} from 'react-router-dom';

let component;
let instance;

let mockFuncs = {
    getApp() {},
    showAppCreationDialog() {}
};

const LinkMock = React.createClass({
    render() {
        return <div className="linkMock">{this.props.children}</div>;
    }
});

describe('NavItem', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NavItemRewireAPI.__Rewire__('Link', LinkMock);
    });

    afterEach(() => {
        NavItemRewireAPI.__ResetDependency__('Link');
    });

    it('will have defaultProps', () => {
        component = mount(<NavItem item={{}} />);

        expect(component).toHaveProp('showSecondary', true);
        expect(component).toHaveProp('isHeading', false);
        expect(component).toHaveProp('showToolTip', false);
        expect(component).toHaveProp('icon', 'favicon');
        expect(component).toHaveProp('iconFont', AVAILABLE_ICON_FONTS.DEFAULT);
    });
});
