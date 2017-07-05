import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../reuse/client/src/components/icon/icon.js';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import {Link} from 'react-router-dom';

let component;
let instance;
let secondaryIcon = 'mockSecondaryIcon';
let mockEvent = {};
let mockHoverComponent = <div className="mockHoverComponent"></div>;
let mockItem = {
    name: 'mockName'
};

const I18nMessageMock = () => <div>test</div>;

let mockFuncs = {
    onClick() {}
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
        NavItemRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        spyOn(mockFuncs, 'onClick');
    });

    afterEach(() => {
        NavItemRewireAPI.__ResetDependency__('Link');
        NavItemRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('will have defaultProps', () => {
        component = mount(<NavItem item={{}} />);

        expect(component).toHaveProp('showSecondary', true);
        expect(component).toHaveProp('isHeading', false);
        expect(component).toHaveProp('showToolTip', false);
        expect(component).toHaveProp('icon', 'favicon');
        expect(component).toHaveProp('iconFont', AVAILABLE_ICON_FONTS.DEFAULT);
    });

    it('will render a heading if isHeading is true with a secondaryIcon', () => {
        component = mount(<NavItem item={{}}
                                   isHeading={true}
                                   secondaryIcon={secondaryIcon} />);

        let li = component.find('li');
        let icon = component.find(Icon);
        expect(li).toHaveClassName("heading withSecondary");
        expect(icon.length).toBe(2);

    });

    it('will render a heading if isHeading is true WITHOUT a secondaryIcon', () => {
        component = mount(<NavItem item={{}}
                                   isHeading={true}
                                   secondaryIcon={false} />);

        let li = component.find('li');
        let icon = component.find(Icon);

        expect(li).toHaveClassName("heading");
        expect(icon.length).toBe(1);

    });

    xit('will invoke onClick if heading is clicked on', () => {
        instance = component.instance();
        spyOn(instance, 'onHeadingClick');

        component = mount(<NavItem item={{}}
                                   isHeading={true}
                                   secondaryIcon={false}
                                   onClick={mockFuncs.onClick} />);

        let li = component.find('li');
        let icon = component.find(Icon);
        icon.simulate('click');

        expect(li.length).toBe(1);
        expect(instance.onHeadingClick).toHaveBeenCalled();
        expect(mockFuncs.onClick).toHaveBeenCalledWith(mockEvent);
    });

    it('will render OverLayTrigger if showToolTip is true and isHeading is false', () => {
        component = mount(<NavItem isHeading={false}
                                   showToolTip={true}
                                   item={mockItem} />);

        expect(component.find(OverlayTrigger)).toBePresent();
    });

    it('will not render OverLayTrigger if showToolTip is false and isHeading is false', () => {
        component = shallow(<NavItem isHeading={false}
                                     showToolTip={false}
                                     item={mockItem} />);

        expect(component.find(OverlayTrigger)).not.toBePresent();
    });

    describe('getLinkItem', () => {
        it('will render a link if isHeading is false', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         secondaryIcon={true}
                                         item={mockItem} />);

            expect(component.find(LinkMock)).toBePresent();
        });

        it('will render a className withSecondary if secondaryIcon is true', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         secondaryIcon={true}
                                         item={mockItem} />);

            expect(component.find('.withSecondary')).toBePresent();
        });

        it('will render a className selected if selected is true', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         selected={true}
                                         item={mockItem} />);

            expect(component.find('.selected')).toBePresent();
        });

        it('will render an anchor tag and an icon if showSecondary and secondaryIcon are both true', () => {
            component = shallow(<NavItem isHeading={false}
                                         showSecondary={true}
                                         secondaryIcon={true}
                                         showToolTip={false}
                                         item={mockItem} />);

            expect(component.find('a')).toBePresent();
            expect(component.find(Icon)).toBePresent();
        });

        it('will render a hover component', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         hoverComponent={mockHoverComponent}
                                         item={mockItem} />);

            expect(component.find('.mockHoverComponent')).toBePresent();
        });

        it('will not render a hover component if it is undefined', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         item={mockItem} />);

            expect(component.find('.mockHoverComponent')).not.toBePresent();
        });
    });
});
