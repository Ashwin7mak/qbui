import React, {Component} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {BuilderCustomDragLayer, TOKEN_WIDTH, TOKEN_HEIGHT, TOKEN_ICON_WIDTH, __RewireAPI__ as DragLayerRewireAPI} from '../../../src/components/dragAndDrop/builderCustomDragLayer';
import ElementToken from '../../../src/components/dragAndDrop/elementToken/elementToken';
import consts from '../../../../../common/src/constants';
import draggableTypes from '../../../src/components/dragAndDrop/draggableItemTypes';

let component;

describe('BuilderCustomDragLayer', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('is hidden if the component is not dragging', () => {
        component = shallow(<BuilderCustomDragLayer isDragging={false} />);

        expect(component.find('.customDragPreview')).not.toBePresent();
    });

    it('displays when an element is being dragged', () => {
        component = shallow(<BuilderCustomDragLayer isDragging={true} />);

        expect(component.find('.customDragPreview')).toBePresent();
    });

    describe('renderItem', () => {
        let testFieldName = 'field name';
        const mockLocale = {
            getMessage(_key) {return testFieldName;}
        };

        beforeEach(() => {
            spyOn(mockLocale, 'getMessage').and.callThrough();
            DragLayerRewireAPI.__Rewire__('Locale', mockLocale);
        });

        afterEach(() => {
            DragLayerRewireAPI.__ResetDependency__('Locale');
        });

        it('does not render if the type does not match a draggable type', () => {
            component = shallow(<BuilderCustomDragLayer isDragging={true} />);

            expect(component.find(ElementToken)).not.toBePresent();
        });

        it('calls getMessage when a valid field type is passed through and name is not available', () => {
            let item = {relatedField: {datatypeAttributes: {type: consts.NUMERIC}}};
            component = shallow(<BuilderCustomDragLayer item={item} isDragging={true} itemType={draggableTypes.FIELD}/>);

            expect(mockLocale.getMessage).toHaveBeenCalled();
        });

        let testCases = [
            {
                description: 'renders a default ElementToken',
                item: null,
                expectedTitle: testFieldName,
                expectedType: consts.TEXT
            },
            {
                description: 'uses the field label as the text if present',
                item: {relatedField: {name: 'Custom Title'}},
                expectedTitle: 'Custom Title',
                expectedType: consts.TEXT
            },
            {
                description: 'uses the field type if present',
                item: {relatedField: {datatypeAttributes: {type: consts.NUMERIC}}},
                expectedTitle: testFieldName,
                expectedType: 2
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<BuilderCustomDragLayer
                    item={testCase.item}
                    itemType={draggableTypes.FIELD}
                    isDragging={true}
                />);

                let fieldToken = component.find(ElementToken);
                expect(fieldToken).toBePresent();
                expect(fieldToken).toHaveProp('title', testCase.expectedTitle);
                expect(fieldToken).toHaveProp('type', testCase.expectedType);
            });
        });
    });

    describe('getItemStyles', () => {
        afterEach(() => {
            DragLayerRewireAPI.__ResetDependency__('Device');
        });

        it('hides the dragging preview if there is no position', () => {
            component = shallow(<BuilderCustomDragLayer isDragging={true} />);

            expect(component.find('.previewContainer')).toHaveProp('style', {display: 'none'});
        });

        it('places the drag preview (specifically the field icon) under the cursor on non-touch devices', () => {
            DragLayerRewireAPI.__Rewire__('Device', {isTouch: () => false});
            component = shallow(<BuilderCustomDragLayer
                isDragging={true}
                currentOffset={{x: TOKEN_ICON_WIDTH / 2, y: TOKEN_HEIGHT / 2}}
            />);

            expect(component.find('.previewContainer')).toHaveProp('style', {
                transform: 'translate3d(0px, 0px, 0px)',
                WebkitTransform: 'translate3d(0px, 0px, 0px)'
            });
        });

        it('centers the drag preview under the cursor on touch devices', () => {
            DragLayerRewireAPI.__Rewire__('Device', {isTouch: () => true});
            component = shallow(<BuilderCustomDragLayer
                isDragging={true}
                currentOffset={{x: TOKEN_WIDTH / 2, y: TOKEN_HEIGHT / 2}}
            />);

            expect(component.find('.previewContainer')).toHaveProp('style', {
                transform: 'translate3d(0px, 0px, 0px)',
                WebkitTransform: 'translate3d(0px, 0px, 0px)'
            });
        });
    });
});
