import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../reuse/client/src/components/icon/icon.js';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import {Link} from 'react-router-dom';

let component;
let instance;
let mockHoverComponent = <div className="mockHoverComponent"></div>;
let secondaryIcon = 'mockSecondaryIcon';

let mockItem = {
    name: 'mockName'
};

const I18nMessageMock = () => <div>test</div>;

let mockFuncs = {
    onClick() {},
    onSelect() {},
    secondaryOnSelect() {}
};

const LinkMock = React.createClass({
    render() {
        return <div className="linkMock">{this.props.children}</div>;
    }
});

const mockA11Utils = {
    isA11yClick() {}
};

describe('NavItem', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NavItemRewireAPI.__Rewire__('Link', LinkMock);
        NavItemRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        NavItemRewireAPI.__Rewire__('A11Utils', mockA11Utils);
        spyOn(mockFuncs, 'onClick');
        spyOn(mockFuncs, 'onSelect');
        spyOn(mockFuncs, 'secondaryOnSelect');
        spyOn(mockA11Utils, 'isA11yClick').and.returnValue(true);
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
    });

    it('will render the icon the user chooses', () => {
        component = shallow(<NavItem item={{}}
                                     icon="Customer"
                                     iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                                     defaultIcon="favicon"
                                     defaultIconFont={AVAILABLE_ICON_FONTS.DEFAULT}/>);

        expect(component.find({icon: 'Customer', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY})).toBePresent();
    });

    it('will render the defaultIcon and defaultIconFont if icon and iconfont are undefined', () => {
        component = shallow(<NavItem item={{}}
                                     defaultIcon="favicon"
                                     defaultIconFont={AVAILABLE_ICON_FONTS.DEFAULT}/>);

        expect(component.find({icon: 'favicon', iconFont: AVAILABLE_ICON_FONTS.DEFAULT})).toBePresent();
    });

    it('will render a heading if isHeading is true with a secondaryIcon', () => {
        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={secondaryIcon} />);

        let headingWithSecondary = component.find('.heading .withSecondary');
        let icon = component.find(Icon);
        expect(headingWithSecondary).toHaveClassName("heading withSecondary");
        //two icons will be present since there is a secondaryIcon being passed in
        expect(icon.length).toBe(2);

    });

    it('will render a heading if isHeading is true WITHOUT a secondaryIcon', () => {
        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false} />);

        let heading = component.find('.heading');
        let icon = component.find(Icon);

        expect(heading).toHaveClassName('.heading');
        //only one icon will render with no secondaryIcon
        expect(icon.length).toBe(1);

    });

    it('will invoke onClick if heading is clicked', () => {
        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        let heading = component.find('.heading').simulate('click');

        expect(mockFuncs.onClick).toHaveBeenCalled();
    });

    it('will render OverlayTrigger if showToolTip is true and isHeading is false', () => {
        component = shallow(<NavItem isHeading={false}
                                     showToolTip={true}
                                     item={mockItem} />);

        expect(component.find(OverlayTrigger)).toBePresent();
    });

    it('will not render OverlayTrigger if showToolTip is false and isHeading is false', () => {
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

        it('will not render a className withSecondary if secondaryIcon is false', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         secondaryIcon={false}
                                         item={mockItem} />);

            expect(component.find('.withSecondary')).not.toBePresent();
        });

        it('will render a className selected if selected is true', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         selected={true}
                                         item={mockItem} />);

            expect(component.find('.selected')).toBePresent();
        });

        it('will not render a className selected if selected is false', () => {
            component = shallow(<NavItem isHeading={false}
                                         showToolTip={false}
                                         selected={false}
                                         item={mockItem} />);

            expect(component.find('.selected')).not.toBePresent();
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

        it('will not render an anchor tag and an icon if showSecondary and secondaryIcon are both false', () => {
            component = shallow(<NavItem isHeading={false}
                                         showSecondary={false}
                                         secondaryIcon={false}
                                         showToolTip={false}
                                         item={mockItem} />);

            expect(component.find('a')).not.toBePresent();
            //only one icons render when showSecondary && secondaryIcon are false
            expect(component.find(Icon).length).toBe(1);
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

        it('will invoke onSelect if link is clicked', () => {
            component = shallow(<NavItem item={{}}
                                         isHeading={false}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick();

            expect(mockFuncs.onSelect).toHaveBeenCalled();
        });

        it('will invoke secondaryOnSelect if anchor is clicked', () => {
            component = shallow(<NavItem isHeading={false}
                                         showSecondary={true}
                                         secondaryIcon={true}
                                         showToolTip={false}
                                         item={mockItem}
                                         secondaryOnSelect={mockFuncs.secondaryOnSelect} />);

            component.find('.right').simulate('click');
            expect(mockFuncs.secondaryOnSelect).toHaveBeenCalled();
        });
    });
});
