import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../reuse/client/src/components/icon/icon.js';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import {Link} from 'react-router-dom';
import _ from 'lodash';

let component;
let instance;
let mockHoverComponent = <div className="mockHoverComponent"></div>;
let secondaryIcon = 'mockSecondaryIcon';

let mockClickEvent = {
    nativeEvent: {type: 'click'}
};

let mockMouseEvent = {
    nativeEvent: {type: 'keydown'},
    keyCode: 32
};

let mockItem = {
    name: 'mockName'
};

const I18nMessageMock = () => <div>test</div>;

let mockFuncs = {
    onClick() {},
    onSelect() {}
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
        spyOn(mockFuncs, 'onSelect');
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

    it('will render a default icon of favicon if no icon is passed in', () => {
        component = mount(<NavItem item={{}} />);

        expect(component.find('.qbIcon .iconUISturdy-favicon')).toBePresent();
    });

    it('will render a default icon of favicon if iconFont or icon are undefined', () => {
        component = mount(<NavItem item={{}}
                                   icon={undefined}
                                   iconFont={undefined} />);

        expect(component.find('.qbIcon .iconUISturdy-favicon')).toBePresent();
    });

    it('will render the icon the user chooses', () => {
        component = mount(<NavItem item={{}}
                                   icon="Customer"
                                   iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} />);

        expect(component.find('.qbIcon .iconTableSturdy-Customer')).toBePresent();
    });

    it('will render a heading if isHeading is true with a secondaryIcon', () => {
        component = shallow(<NavItem item={{}}
                                   isHeading={true}
                                   secondaryIcon={secondaryIcon} />);

        let li = component.find('li');
        let icon = component.find(Icon);
        expect(li).toHaveClassName("heading withSecondary");
        expect(icon.length).toBe(2);

    });

    it('will render a heading if isHeading is true WITHOUT a secondaryIcon', () => {
        component = shallow(<NavItem item={{}}
                                   isHeading={true}
                                   secondaryIcon={false} />);

        let li = component.find('li');
        let icon = component.find(Icon);

        expect(li).toHaveClassName("heading");
        //only one icon will render with no secondaryIcon
        expect(icon.length).toBe(1);

    });

    it('will invoke onClick if heading is clicked', () => {
        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        instance.onHeadingClick(mockClickEvent);

        expect(mockFuncs.onClick).toHaveBeenCalledWith(mockClickEvent);
    });

    it('will invoke onClick if the heading is touched', () => {
        let cloneMockClickEvent = _.cloneDeep(mockClickEvent);
        cloneMockClickEvent.nativeEvent.type = 'touchend';

        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        instance.onHeadingClick(cloneMockClickEvent);

        expect(mockFuncs.onClick).toHaveBeenCalledWith(cloneMockClickEvent);
    });

    it('will invoke onClick if space bar is pressed', () => {
        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        instance.onHeadingClick(mockMouseEvent);

        expect(mockFuncs.onClick).toHaveBeenCalledWith(mockMouseEvent);
    });

    it('will invoke onClick if enter is pressed', () => {
        let cloneMockMouseEvent = _.cloneDeep(mockMouseEvent);
        cloneMockMouseEvent.keyCode = 13;

        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        instance.onHeadingClick(cloneMockMouseEvent);

        expect(mockFuncs.onClick).toHaveBeenCalledWith(cloneMockMouseEvent);
    });

    it('will not invoke onClick if neither space bar or enter is pressed', () => {
        let cloneMockMouseEvent = _.cloneDeep(mockMouseEvent);
        cloneMockMouseEvent.keyCode = 99;

        component = shallow(<NavItem item={{}}
                                     isHeading={true}
                                     secondaryIcon={false}
                                     onClick={mockFuncs.onClick} />);

        instance = component.instance();
        instance.onHeadingClick(cloneMockMouseEvent);

        expect(mockFuncs.onClick).not.toHaveBeenCalled();
    });

    it('will render OverLayTrigger if showToolTip is true and isHeading is false', () => {
        component = shallow(<NavItem isHeading={false}
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

        it('will not render an anchor tag and an icon if showSecondary and secondaryIcon are both true', () => {
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
                                         isHeading={true}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick(mockClickEvent);

            expect(mockFuncs.onSelect).toHaveBeenCalledWith(mockClickEvent);
        });

        it('will invoke onSelect if the link is touched', () => {
            let cloneMockClickEvent = _.cloneDeep(mockClickEvent);
            cloneMockClickEvent.nativeEvent.type = 'touchend';

            component = shallow(<NavItem item={{}}
                                         isHeading={true}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick(cloneMockClickEvent);

            expect(mockFuncs.onSelect).toHaveBeenCalledWith(cloneMockClickEvent);
        });

        it('will invoke onSelect if space bar is pressed', () => {
            component = shallow(<NavItem item={{}}
                                         isHeading={true}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick(mockMouseEvent);

            expect(mockFuncs.onSelect).toHaveBeenCalledWith(mockMouseEvent);
        });

        it('will invoke onSelect if enter is pressed', () => {
            let cloneMockMouseEvent = _.cloneDeep(mockMouseEvent);
            cloneMockMouseEvent.keyCode = 13;

            component = shallow(<NavItem item={{}}
                                         isHeading={true}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick(cloneMockMouseEvent);

            expect(mockFuncs.onSelect).toHaveBeenCalledWith(cloneMockMouseEvent);
        });

        it('will not invoke onSelect if neither space bar or enter is pressed', () => {
            let cloneMockMouseEvent = _.cloneDeep(mockMouseEvent);
            cloneMockMouseEvent.keyCode = 99;

            component = shallow(<NavItem item={{}}
                                         isHeading={true}
                                         secondaryIcon={false}
                                         onSelect={mockFuncs.onSelect} />);

            instance = component.instance();
            instance.onClick(cloneMockMouseEvent);

            expect(mockFuncs.onSelect).not.toHaveBeenCalled();
        });
    });
});
