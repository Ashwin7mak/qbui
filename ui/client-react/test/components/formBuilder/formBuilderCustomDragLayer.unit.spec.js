import React, {Component} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FormBuilderCustomDragLayer, TOKEN_WIDTH, TOKEN_HEIGHT, TOKEN_ICON_WIDTH, __RewireAPI__ as DragLayerRewireAPI} from '../../../src/components/formBuilder/formBuilderCustomDragLayer';
import FieldToken from '../../../src/components/formBuilder/fieldToken/fieldToken';
import consts from '../../../../common/src/constants';
import draggableTypes from '../../../src/components/formBuilder/draggableItemTypes';

let component;

describe('FormBuilderCustomDragLayer', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('is hidden if the component is not dragging', () => {
        component = shallow(<FormBuilderCustomDragLayer isDragging={false} />);

        expect(component.find('.customDragPreview')).not.toBePresent();
    });

    it('displays when an element is being dragged', () => {
        component = shallow(<FormBuilderCustomDragLayer isDragging={true} />);

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
            component = shallow(<FormBuilderCustomDragLayer isDragging={true} />);

            expect(component.find(FieldToken)).not.toBePresent();
        });

        let testCases = [
            {
                description: 'renders a default FieldToken',
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
                item: {relatedField: {datatypeAttributes: {type: 'custom type'}}},
                expectedTitle: testFieldName,
                expectedType: 'custom type'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<FormBuilderCustomDragLayer
                    item={testCase.item}
                    itemType={draggableTypes.FIELD}
                    isDragging={true}
                />);

                let fieldToken = component.find(FieldToken);
                expect(fieldToken).toBePresent();
                expect(fieldToken).toHaveProp('title', testCase.expectedTitle);
                expect(fieldToken).toHaveProp('type', testCase.expectedType);
            });
        });
    });

    describe('getItemStyles', () => {
        it('hides the dragging preview if there is no position', () => {
            component = shallow(<FormBuilderCustomDragLayer isDragging={true} />);

            expect(component.find('.previewContainer')).toHaveProp('style', {display: 'none'});
        });

        it('places the drag preview (specifically the field icon) under the cursor on desktop/tablet', () => {
            component = shallow(<FormBuilderCustomDragLayer
                isDragging={true}
                currentOffset={{x: TOKEN_ICON_WIDTH / 2, y: TOKEN_HEIGHT / 2}}
            />);

            expect(component.find('.previewContainer')).toHaveProp('style', {
                transform: 'translate(0px, 0px)',
                WebkitTransform: 'translate(0px, 0px)'
            });
        });

        it('centers the drag preview under the cursor on small devices', () => {
            DragLayerRewireAPI.__Rewire__('Breakpoints', {isSmallBreakpoint: () => true});
            component = shallow(<FormBuilderCustomDragLayer
                isDragging={true}
                currentOffset={{x: TOKEN_WIDTH / 2, y: TOKEN_HEIGHT / 2}}
            />);

            expect(component.find('.previewContainer')).toHaveProp('style', {
                transform: 'translate(0px, 0px)',
                WebkitTransform: 'translate(0px, 0px)'
            });

            DragLayerRewireAPI.__ResetDependency__('Breakpoints', {isSmallBreakPoint: () => true});
        });
    });
});
