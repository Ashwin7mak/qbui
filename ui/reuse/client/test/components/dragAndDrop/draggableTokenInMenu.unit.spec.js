import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {DraggableTokenInMenu, FieldToken} from '../../../src/components/dragAndDrop/elementToken/draggableTokenInMenu';
import {ENTER_KEY, SPACE_KEY} from '../../../src/components/keyboardShortcuts/keyCodeConstants';

let component;

const testTitle = "Diggin' the New Soul Playlist on Spotify";
const mockKeyboardEvent = key => ({which: key, preventDefault() {}});

describe('DraggableTokenInMenu', () => {
    let onClickToken;

    beforeEach(() => {
        jasmineEnzyme();

        onClickToken = jasmine.createSpy('onClickToken');
    });

    it('can be clicked', () => {
        component = shallow(<DraggableTokenInMenu title={testTitle} onClickToken={onClickToken} />);

        component.simulate('click');

        expect(onClickToken).toHaveBeenCalledWith(component.instance().props);
    });

    it('calls the click event when the enter key is pressed (while focused on the element)', () => {
        component = shallow(<DraggableTokenInMenu title={testTitle} onClickToken={onClickToken} />);

        component.simulate('keyDown', mockKeyboardEvent(ENTER_KEY));

        expect(onClickToken).toHaveBeenCalledWith(component.instance().props);
    });

    it('calls the click event if space bar key is pressed (while focused on the element)', () => {
        component = shallow(<DraggableTokenInMenu title={testTitle} onClickToken={onClickToken} />);

        component.simulate('keyDown', mockKeyboardEvent(SPACE_KEY));

        expect(onClickToken).toHaveBeenCalledWith(component.instance().props);
    });

    it('renders a FieldToken element with the correct props', () => {
        const testProps = {
            beginDrag() {},
            otherProp: 'test'
        };

        component = shallow(<DraggableTokenInMenu
            title={testTitle}
            {...testProps}
        />);
        const instance = component.instance();

        const fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('beginDrag', testProps.beginDrag);
        expect(fieldToken).toHaveProp('onHover', instance.onHover);
        expect(fieldToken).toHaveProp('endDrag', instance.endDrag);
        // Also passed any extra props through to the child component
        expect(fieldToken).toHaveProp('otherProp', testProps.otherProp);
    });

    // The following actions are tested directly because they are fired by React DnD instead of through the component direction.
    describe('drag and drop functions', () => {
        describe('onHover', () => {
            let onHover;
            let onHoverBeforeAdded;

            beforeEach(() => {
                onHover = jasmine.createSpy('onHover');
                onHoverBeforeAdded = jasmine.createSpy('onHoverBeforeAdded');
            });

            it('calls the onHover action (passed in as prop) if the component has already been dropped once', () => {
                component = shallow(<DraggableTokenInMenu title={testTitle} onHover={onHover} onHoverBeforeAdded={onHoverBeforeAdded} />);
                const instance = component.instance();
                component.setState({hasAttemptedDrop: true});

                instance.onHover();

                expect(onHover).toHaveBeenCalled();
                expect(onHoverBeforeAdded).not.toHaveBeenCalled();
                expect(component).toHaveState('hasAttemptedDrop', true);
            });

            it('calls the onHoverBeforeAdded action (passed in as prop) if the comonent has not been dropped yet', () => {
                component = shallow(<DraggableTokenInMenu title={testTitle} onHover={onHover} onHoverBeforeAdded={onHoverBeforeAdded} />);
                const instance = component.instance();

                instance.onHover();

                expect(onHoverBeforeAdded).toHaveBeenCalled();
                expect(onHover).not.toHaveBeenCalled();
                expect(component).toHaveState('hasAttemptedDrop', true);
            });
        });

        describe('endDrag', () => {
            it('resets the hasAttemptedDropState', () => {
                component = shallow(<DraggableTokenInMenu title={testTitle} />);
                const instance = component.instance();
                component.setState({hasAttemptedDrop: true});

                instance.endDrag();

                expect(component).toHaveState('hasAttemptedDrop', false);
            });

            it('calls the onHover action (passed through props)', () => {
                let endDrag = jasmine.createSpy('endDrag');
                component = shallow(<DraggableTokenInMenu title={testTitle} endDrag={endDrag} />);
                const instance = component.instance();

                instance.endDrag();

                expect(endDrag).toHaveBeenCalledWith(instance.props);
            });
        });
    });
});
