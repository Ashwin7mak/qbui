import React from 'react';
import ColumnTransformer from '../../../src/components/dataTable/qbGrid/columnTransformer';
import _ from 'lodash';

const testHeaderLabel = 'Jack Skellington';
const testCellIdentifierValue = 'Halloweentown';
const testFormatter = (cell) => 'Nightmare Before Christmas';
const TestHeaderComponent = React.createClass({render() {return <h1>Sally</h1>;}});
const testHeaderProps = {type: 'Rag Doll', stuffing: 'Fall Leaves'};

describe('ColumnTransformer', () => {
    describe('new', () => {
        it('creates a new instance of a columnTransformer', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);

            expect(columnTransformer.headerLabel).toEqual(testHeaderLabel);
            expect(columnTransformer.cellIdentifierValue).toEqual(testCellIdentifierValue);
            expect(columnTransformer.classes).toEqual('');
            expect(columnTransformer.formatter).toEqual(null);
            expect(columnTransformer.headerMenuComponent).toEqual(null);
            expect(columnTransformer.headerMenuProps).toEqual({});
        });

        it('optionally sets classes on the new instance of the ColumnTransformer', () => {
            const testClasses = 'oogie-boogie-man';
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue, testClasses);

            expect(columnTransformer.classes).toEqual(testClasses);
        });
    });

    describe('addFormatter', () => {
        it('adds a formatter to the instance of the ColumnTransformer', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);
            expect(columnTransformer.formatter).toEqual(null);

            columnTransformer.addFormatter(testFormatter);

            expect(columnTransformer.formatter).toEqual(testFormatter);
        });
    });

    describe('addHeaderMenu', () => {
        it('adds a header menu component and properties to the instances of the ColumnTransformer', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);
            expect(columnTransformer.headerMenuComponent).toEqual(null);
            expect(columnTransformer.headerMenuProps).toEqual({});

            columnTransformer.addHeaderMenu(TestHeaderComponent, testHeaderProps);

            expect(columnTransformer.headerMenuComponent).toEqual(TestHeaderComponent);
            expect(columnTransformer.headerMenuProps).toEqual(testHeaderProps);
        });

        it('defaults to an empty object for props if props are not passed in', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);

            columnTransformer.addHeaderMenu(TestHeaderComponent);

            expect(columnTransformer.headerMenuProps).toEqual({});
        });
    });

    describe('getGridHeader', () => {
        const expectedOutput = {
            property: testCellIdentifierValue,
            header: {
                label: <span className="">{testHeaderLabel}</span>
            }
        };

        it('converts the ColumnTransformer instance into a column object that can be consumed by QbGrid', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);

            expect(_.isEqual(columnTransformer.getGridHeader(), expectedOutput)).toEqual(true);
        });

        it('adds a cell formatter if it is set', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);
            columnTransformer.addFormatter(testFormatter);

            const expectedOutputWithFormatter = Object.assign({}, expectedOutput, {
                cell: {
                    formatters: [testFormatter]
                }
            });

            expect(_.isEqual(columnTransformer.getGridHeader(), expectedOutputWithFormatter)).toEqual(true);
        });

        it('adds a menu component if it is set', () => {
            let columnTransformer = new ColumnTransformer(testHeaderLabel, testCellIdentifierValue);
            columnTransformer.addHeaderMenu(TestHeaderComponent, testHeaderProps);

            const expectedOutputWithHeaderMenu = Object.assign({}, expectedOutput, {
                header: {
                    label: (
                        <span className="">
                            {testHeaderLabel}
                            <div className="headerMenu">
                                <TestHeaderComponent {...testHeaderProps} />
                            </div>
                        </span>
                    )
                }
            });

            expect(_.isEqual(columnTransformer.getGridHeader(), expectedOutputWithHeaderMenu)).toEqual(true);
        });
    });
});
