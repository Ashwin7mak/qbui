import React from "react";
import {shallow, mount} from "enzyme";
import jasmineEnzyme from "jasmine-enzyme";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import {__RewireAPI__ as GenericFacetsItemRewireAPI}  from "../../../../reuse/client/src/components/facets/genericFacetItem";
import {__RewireAPI__ as GenericFacetsListRewireAPI}  from "../../../../reuse/client/src/components/facets/genericFacetsList";
import {StandardGridFacetsMenu} from "../../../src/common/grid/toolbar/StandardGridFacetsMenu";
import GenericFacetMenu from "../../../../reuse/client/src/components/facets/genericFacetMenu";
import _ from "lodash";

const I18nMessageMock = () => <div>test</div>;

const mockParentActions = {
    showFacetMenu() {},
    hideFacetMenu() {},
    setFacetsExpanded() {},
    setFacetsMoreRevealed() {},
    toggleFacetMenu() {}
};

describe('StandardGridFacetsMenu functions', () => {
    let component;

    const fakeFacetsData_valid = {
        facets : [
            {id : 1, name : 'test', type : "TEXT", values : [{value : "a"}, {value : "b"}, {value : "c"}]}
        ]
    };

    const fakeFacetsLongData_valid = {
        facets : [{id : 1, name : 'test', type : "TEXT",
            values : [{value : "a"}, {value : "b"}, {value : "c"}, {value : "d"}, {value : "e"}, {value : "f"}]}
        ]
    };

    beforeEach(() => {
        jasmineEnzyme();
        GenericFacetsListRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        GenericFacetsItemRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        GenericFacetsListRewireAPI.__ResetDependency__('I18nMessage');
        GenericFacetsItemRewireAPI.__ResetDependency__('I18nMessage');
    });


    it('renders GenericFacetMenu component', () => {
        component = shallow(<StandardGridFacetsMenu />);

        expect(component.find(GenericFacetMenu)).toBePresent();
    });

    it('render FacetsMenu with facets', () => {
        spyOn(mockParentActions, 'showFacetMenu');

        component = mount(<StandardGridFacetsMenu show={true}
                                                  facetFields={fakeFacetsData_valid}
                                                  showFacetMenu={mockParentActions.showFacetMenu} />);

        expect(component.find('.popoverShown')).toBePresent();

    });

    it('render FacetsMenu with no facets', () => {
        spyOn(mockParentActions, 'showFacetMenu');

        component = mount(<StandardGridFacetsMenu show={false}
                                                  facetFields={fakeFacetsData_valid}
                                                  showFacetMenu={mockParentActions.showFacetMenu} />);

        expect(component.find('.popoverShown')).not.toBePresent();

    });

    it('render FacetsMenu shows selection tokens', () => {
        let selected = {
            1 : ['a', 'c']
        };
        let callbacks = {
            onFacetSelect(e, facet, value) {}
        };
        spyOn(callbacks, 'onFacetSelect');

        component = mount(<StandardGridFacetsMenu show={true}
                                                  popoverId="test"
                                                  facetFields={fakeFacetsData_valid}
                                                  selectedValues={selected}
                                                  onFacetSelect={(facet, value, e) => callbacks.onFacetSelect(facet, value, e)}
        />);

        // selection tokens rendered
        let tokens = component.find(".selectedTokenName");
        expect(tokens).toBePresent();
        expect(tokens.length).toEqual(2);

        tokens = component.find('.selectedTokenName');
        tokens.at(1).simulate('click');
        expect(callbacks.onFacetSelect).toHaveBeenCalled();

        //click on clear icon deselects
        let tokenClears = component.find('.clearFacet');
        tokenClears.at(1).simulate('click');
        expect(callbacks.onFacetSelect).toHaveBeenCalledWith(jasmine.any(Object), 'c', jasmine.any(Object));
        callbacks.onFacetSelect.calls.reset();
    });

    describe('Expand/Collapse sections', () => {
        let mountPoint;

        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('render FacetsMenu click facet section expand ', () => {
            class MockParent extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        expanded : []
                    };
                }

                mockSetFacetsExpanded = (newExpanded) => this.setState({expanded : newExpanded.expanded});
                render() {
                    return (
                        <StandardGridFacetsMenu show={true}
                                                expandedFacetFields={this.state.expanded}
                                                setFacetsExpanded={this.mockSetFacetsExpanded}
                                                facetFields={fakeFacetsData_valid}
                        />
                    );
                }
            }

            component = ReactDOM.render(<MockParent />, mountPoint);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            let facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            let popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that the field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            // expand the facet panel
            let RenderedFacetsMenu = TestUtils.findRenderedComponentWithType(component, StandardGridFacetsMenu);

            RenderedFacetsMenu.handleToggleCollapse({id : 1}, null);

            //ensure its in the expanded list
            expect(_.includes(RenderedFacetsMenu.props.expandedFacetFields, 1)).toBeTruthy();

            let panelCollapses = ReactDOM.findDOMNode(RenderedFacetsMenu).getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);

            let panelCollapse = panelCollapses[0];
            let innerText = panelCollapse.innerText;
            expect(innerText.replace(/\s/g, '')).toBe('abc');
            //and not hidden
            let subItem = panelCollapse.getElementsByClassName('list-group-item');
            expect(subItem.length).toBe(3); //expanded has children

        });

        it('render FacetsMenu click facet section collapse ', () => {
            let expanded = [];
            component = ReactDOM.render(<StandardGridFacetsMenu show={true}
                                                                expandedFacetFields={expanded}
                                                                setFacetsExpanded={mockParentActions.setFacetsExpanded}
                                                                popoverId="test"
                                                                facetFields={fakeFacetsData_valid} />
                , mountPoint);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            let facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            let popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that tht field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);

            // expand the facet panel
            component.handleToggleCollapse({id : 1}, null);
            // then collapse the facet panel
            component.handleToggleCollapse({id : 1}, null);

            //ensure its not  the expanded list
            expect(_.includes(component.props.expandedFacetFields, 1)).toBeFalsy();

            // and not visible
            let panelCollapses = ReactDOM.findDOMNode(component).getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);
            let panelCollapse = panelCollapses[0];
            let subItem = panelCollapse.getElementsByClassName('list-group-item');
            expect(subItem.length).toBe(0); //collapsed no children

        });
    });

    describe('Show More', () => {

        let mountPoint;
        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('test render FacetsMenu click facet reveal', () => {

            class MockParent extends React.Component {

                constructor(props) {
                    super(props);
                    this.state = {
                        expanded : [],
                        moreRevealedFacetFields : []
                    };
                }

                setFacetsMoreRevealed = (newExpanded) => this.setState({moreRevealedFacetFields : newExpanded.moreRevealed});
                render() {
                    return (
                        <StandardGridFacetsMenu show={true}
                                                expandedFacetFields={this.state.expanded}
                                                setFacetsMoreRevealed={this.setFacetsMoreRevealed}
                                                moreRevealedFacetFields={this.state.moreRevealedFacetFields}
                                                facetFields={fakeFacetsData_valid}
                        />
                    );
                }
            }

            component = ReactDOM.render(<MockParent />, mountPoint);

            let facetsMenu = TestUtils.findRenderedComponentWithType(component, StandardGridFacetsMenu);

            // show the menu
            let facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            let popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);

            // not initially revealed
            expect(facetsMenu.isRevealed(fakeFacetsLongData_valid.facets[0].id)).toBeFalsy();

            // reveal the long facet values
            facetsMenu.handleRevealMore(null, fakeFacetsLongData_valid.facets[0]);
            expect(facetsMenu.isRevealed(fakeFacetsLongData_valid.facets[0].id)).toBeTruthy();

        });
    });

    describe('showMenu', () => {
        const parentActions = {
            toggleFacetMenu() {}
        };

        beforeEach(() => {
            spyOn(parentActions, 'toggleFacetMenu');
        });

        it('calls the hideFacetMenu callback if the menu is visible', () => {
            component = shallow(<StandardGridFacetsMenu toggleFacetMenu={parentActions.toggleFacetMenu}
                                                        show={true}
            />);

            component.instance().changeMenuVisibility();

            expect(parentActions.toggleFacetMenu).toHaveBeenCalled();
        });

        it('calls the showFacetMenu callback if the menu is hidden', () => {
            component = shallow(<StandardGridFacetsMenu toggleFacetMenu={parentActions.toggleFacetMenu}
                                                        show={false}
            />);

            component.instance().changeMenuVisibility();

            expect(parentActions.toggleFacetMenu).toHaveBeenCalled();
        });
    });

    describe('handleToggleCollapse', () => {
        it('scrolls the clicked element into view', () => {
            const mockClickEvent = {
                currentTarget : {
                    scrollIntoView() {}
                }
            };
            spyOn(mockClickEvent.currentTarget, 'scrollIntoView');

            component = shallow(<StandardGridFacetsMenu />);

            component.instance().handleToggleCollapse(undefined, false, mockClickEvent);

            expect(mockClickEvent.currentTarget.scrollIntoView).toHaveBeenCalledWith(true);
        });
    });

    describe('setFacetCollapsed', () => {
        it('collapses a facet if it is expanded', () => {
            const testFacet = {id : 16, name : 'test'};
            spyOn(mockParentActions, 'setFacetsExpanded');
            component = shallow(<StandardGridFacetsMenu expandedFacetFields={[testFacet.id]}
                                                        setFacetsExpanded={mockParentActions.setFacetsExpanded}
            />);

            component.instance().setFacetCollapsed(testFacet, true);

            expect(mockParentActions.setFacetsExpanded).toHaveBeenCalledWith({expanded : []});
        });
    });
});
