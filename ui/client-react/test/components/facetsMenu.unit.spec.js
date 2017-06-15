import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetSelections  from '../../../reuse/client/src/components/facets/facetSelections';
import {__RewireAPI__ as GenericFacetsItemRewireAPI}  from '../../../reuse/client/src/components/facets/genericFacetItem';
import {__RewireAPI__ as GenericFacetsListRewireAPI}  from '../../../reuse/client/src/components/facets/genericFacetsList';
import {FacetsMenu} from '../../src/components/facet/facetsMenu';
import GenericFacetMenu from '../../../reuse/client/src/components/facets/genericFacetMenu';
import _ from 'lodash';

const I18nMessageMock = () => <div>test</div>;

const mockParentActions = {
    showFacetMenu() {},
    hideFacetMenu() {},
    setFacetsExpanded() {},
    setFacetsMoreRevealed() {},
};

describe('FacetsMenu functions', () => {
    let component;
    let reportDataParams = {reportData: {loading:false}};
    const fakeReportData_valid = {
        data: {
            facets : [{id:1, name:'test', type:"TEXT",
                values:[{value:"a"}, {value:"b"}, {value:"c"}]}
            ]
        }
    };
    const fakeReportDataNoFacets_valid = {
        data: {
            facets : []
        }
    };

    const fakeReportLongData_valid = {
        data: {
            facets : [{id:1, name:'test', type:"TEXT",
                values:[{value:"a"}, {value:"b"}, {value:"c"}, {value:"d"}, {value:"e"}, {value:"f"}]}
            ]
        }
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

    let reportParams = {appId:1, tblId:2, rptId:3};

    it('renders GenericFacetMenu component', () => {
        component = mount(<FacetsMenu />);

        expect(component.find(GenericFacetMenu)).toBePresent();
    });

    it('test render FacetsMenu with facets', () => {
        spyOn(mockParentActions, 'showFacetMenu');

        component = mount(<FacetsMenu show={false} reportData={fakeReportData_valid} showFacetMenu={mockParentActions.showFacetMenu} />);

        expect(component.find('.popoverShown')).not.toBePresent();

    });

    it('test render FacetsMenu with no facets', () => {
        spyOn(mockParentActions, 'hideFacetMenu');

        component = mount(<FacetsMenu show={true} reportData={reportDataParams} hideFacetMenu={mockParentActions.hideFacetMenu} />);

        let instance = component.instance();
        instance.hideMenu();

        expect(mockParentActions.hideFacetMenu).toHaveBeenCalled();
    });

    it('test render FacetsMenu shows selection tokens', () => {
        let selected = new FacetSelections();
        selected.addSelection(1, 'a');
        selected.addSelection(1, 'c');
        var callbacks = {
            onFacetSelect(e, facet, value) {}
        };

        component = mount(<FacetsMenu show={true}
                                      popoverId="test"
                                      reportData={fakeReportData_valid}
                                      selectedValues={selected}
                                      onFacetSelect={(facet, value, e) => callbacks.onFacetSelect(facet, value, e)} />);

        // selection tokens rendered
        let tokens = component.find(".selectedTokenName");
        expect(tokens.length).toEqual(2);

        //click on token deselects
        spyOn(callbacks, 'onFacetSelect').and.callThrough();
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

        it('test render FacetsMenu click facet section expand ', () => {
            class MockParent extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        expanded: []
                    };
                }

                mockSetFacetsExpanded = (newExpanded) => this.setState({expanded: newExpanded.expanded});
                render() {
                    return (
                        <FacetsMenu show={true}
                                    expandedFacetFields={this.state.expanded}
                                    setFacetsExpanded={this.mockSetFacetsExpanded}
                                    reportData={fakeReportData_valid}
                        />
                    );
                }
            }

            component = ReactDOM.render(<MockParent />, mountPoint);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that the field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            // expand the facet panel
            let RenderedFacetsMenu = TestUtils.findRenderedComponentWithType(component, FacetsMenu);

            RenderedFacetsMenu.handleToggleCollapse({id:1}, null);

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


        it('test render FacetsMenu click facet section collapse ', () => {
            let expanded = [];
            component = ReactDOM.render(<FacetsMenu show={true}
                                                    expandedFacetFields={expanded}
                                                    setFacetsExpanded={mockParentActions.setFacetsExpanded}
                                                    popoverId="test"
                                                    reportData={fakeReportData_valid} />
                , mountPoint);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that tht field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);

            // expand the facet panel
            component.handleToggleCollapse({id:1}, null);
            // then collapse the facet panel
            component.handleToggleCollapse({id:1}, null);

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
            let expanded = [];

            class MockParent extends React.Component {

                constructor(props) {
                    super(props);
                    this.state = {
                        expanded: [],
                        moreRevealedFacetFields: []
                    };
                }

                setFacetsMoreRevealed = (newExpanded) => this.setState({moreRevealedFacetFields: newExpanded.moreRevealed});
                render() {
                    return (
                        <FacetsMenu show={true}
                                    expandedFacetFields={this.state.expanded}
                                    setFacetsMoreRevealed={this.setFacetsMoreRevealed}
                                    moreRevealedFacetFields={this.state.moreRevealedFacetFields}
                                    reportData={fakeReportData_valid}
                        />
                    );
                }
            }

            component = ReactDOM.render(<MockParent />, mountPoint);

            let facetsMenu = TestUtils.findRenderedComponentWithType(component, FacetsMenu);

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // not initially revealed
            expect(facetsMenu.isRevealed(fakeReportLongData_valid.data.facets[0].id)).toBeFalsy();

            // reveal the long facet values
            facetsMenu.handleRevealMore(null, fakeReportLongData_valid.data.facets[0]);
            expect(facetsMenu.isRevealed(fakeReportLongData_valid.data.facets[0].id)).toBeTruthy();

        });
    });

    describe('showMenu', () => {
        const parentActions = {
            showFacetMenu() {},
            hideFacetMenu() {}
        };

        beforeEach(() => {
            spyOn(parentActions, 'showFacetMenu');
            spyOn(parentActions, 'hideFacetMenu');
        });

        it('calls the hideFacetMenu callback if the menu is visible', () => {
            component = shallow(<FacetsMenu
                showFacetMenu={parentActions.showFacetMenu}
                hideFacetMenu={parentActions.hideFacetMenu}
                show={true}
            />);

            component.instance().showMenu();

            expect(parentActions.hideFacetMenu).toHaveBeenCalled();
            expect(parentActions.showFacetMenu).not.toHaveBeenCalled();
        });

        it('calls the showFacetMenu callback if the menu is hidden', () => {
            component = shallow(<FacetsMenu
                showFacetMenu={parentActions.showFacetMenu}
                hideFacetMenu={parentActions.hideFacetMenu}
                show={false}
            />);

            component.instance().showMenu();

            expect(parentActions.showFacetMenu).toHaveBeenCalled();
            expect(parentActions.hideFacetMenu).not.toHaveBeenCalled();
        });
    });

    describe('handleToggleCollapse', () => {
        it('scrolls the clicked element into view', () => {
            const mockClickEvent = {
                currentTarget: {
                    scrollIntoView() {}
                }
            };
            spyOn(mockClickEvent.currentTarget, 'scrollIntoView');

            component = shallow(<FacetsMenu />);

            component.instance().handleToggleCollapse(undefined, false, mockClickEvent);

            expect(mockClickEvent.currentTarget.scrollIntoView).toHaveBeenCalledWith(true);
        });
    });

    describe('setFacetCollapsed', () => {
        it('collapses a facet if it is expanded', () => {
            const testFacet = {id: 16, name: 'test'};
            spyOn(mockParentActions, 'setFacetsExpanded');
            component = shallow(<FacetsMenu expandedFacetFields={[testFacet.id]} setFacetsExpanded={mockParentActions.setFacetsExpanded} />);

            component.instance().setFacetCollapsed(testFacet, true);

            expect(mockParentActions.setFacetsExpanded).toHaveBeenCalledWith({expanded: []});
        });
    });
});
