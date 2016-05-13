import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewList from '../../src/components/dataTable/cardView/cardViewList';

const singleNodeTreeData = {
    children : [
        {group:"group1",
            children: ["child1", "child2", "child3"]}
    ]
};

const multiNodeTreeData = {
    children : [
        {group:"group1",
            children: ["child1", "child2", "child3"]},
        {group:"group2",
            children: ["child1", "child2", "child3"]},
        {group:"group3",
            children: [
                {group:"group31",
                    children: ["child1", "child2", "child3"]},
                {group:"group32",
                    children: ["child1", "child2", "child3"]}]
        }
    ]
};

const CardViewMock = React.createClass({
    render: function() {
        return (
            <div className="cardView">test</div>
        );
    }
});

describe('CardViewList functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        CardViewList.__Rewire__('CardView', CardViewMock);
    });

    afterEach(() => {
        CardViewList.__ResetDependency__('CardView');
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<CardViewList />);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(0);
    });

    it('test render of empty component', () => {

        component = TestUtils.renderIntoDocument(<CardViewList node={{}}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(1);
    });

    it('test render of single cardviewlist component', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                history: React.PropTypes.object
            },
            getChildContext: function() {
                return {
                    history: {push() {return;}}
                };
            },
            render() {
                return <CardViewList ref="cardViewListRef" node={singleNodeTreeData} />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.cardViewListRef;

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cardList = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cardList.length).toEqual(2);
        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(3);

        let card = TestUtils.scryRenderedComponentsWithType(component, CardViewMock);
        expect(TestUtils.isCompositeComponent(card[0])).toBeTruthy();
    });

    it('test render of multiple cardviewlist components', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                history: React.PropTypes.object
            },
            getChildContext: function() {
                return {
                    history: {push() {return;}}
                };
            },
            render() {
                return <CardViewList ref="cardViewListRef" node={multiNodeTreeData} />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.cardViewListRef;

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cardList = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cardList.length).toEqual(6);
        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(12);

        let card = TestUtils.scryRenderedComponentsWithType(component, CardViewMock);
        expect(TestUtils.isCompositeComponent(card[0])).toBeTruthy();

    });
});
