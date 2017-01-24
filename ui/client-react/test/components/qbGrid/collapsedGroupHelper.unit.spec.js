import CollapsedGroupHelper from '../../../src/components/dataTable/qbGrid/collapsedGroupHelper';

describe('CollapsedGroupHelper', () => {
    describe('isGrouped', () => {
        let testCases = [
            {
                description: 'returns false if there are rows that are subheaders',
                rows: [{id: 1, isSubHeader: false}, {id: 2, isSubHeader: false}, {id: 3}],
                expectedValue: false
            },
            {
                description: 'returns true if there are rows that are subheaders',
                rows: [{id: 1, isSubHeader: false}, {id: 2, isSubHeader: true}, {id: 3}],
                expectedValue: true
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(CollapsedGroupHelper.isGrouped(testCase.rows)).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('new', () => {
        it('creates a default instance', () => {
            let collapsedGroupHelper = new CollapsedGroupHelper();
            expect(collapsedGroupHelper.rows).toEqual([]);
            expect(collapsedGroupHelper.collapsedGroups).toEqual([]);
            expect(collapsedGroupHelper.subHeaderRows).toEqual([]);
        });

        let testCases = [
            {
                description: 'current rows and collapsed groups can be passed into the constructor',
                rows: [{id: 1}, {id: 2}, {id: 3}],
                collapsedGroups: [1, 2],
                subHeaderRows: []
            },
            {
                description: 'if passed in rows have subheaders, they are added as subheaders on the instance',
                rows: [{id: 1}, {id: 2, isSubHeader: true}, {id: 3}, {id: 4, isSubHeader: true}],
                collapsedGroups: [2],
                subHeaderRows: [{id: 2, isSubHeader: true}, {id:4, isSubHeader: true}]
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.rows).toEqual(testCase.rows);
                expect(collapsedGroupHelper.collapsedGroups).toEqual(testCase.collapsedGroups);
                expect(collapsedGroupHelper.subHeaderRows).toEqual(testCase.subHeaderRows);
            });
        });
    });

    describe('areAllCollapsed', () => {
        let testCases = [
            {
                description: 'returns false if not all groups are collapsed',
                collapsedGroups: [1],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: false
            },
            {
                description: 'returns true if all groups are collapsed',
                collapsedGroups: [1, 2, 3],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: true
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.areAllCollapsed()).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('areSomeCollapsed', () => {
        let testCases = [
            {
                description: 'returns false if there are no collapsed grouped',
                collapsedGroups: [],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: false
            },
            {
                description: 'returns false if all groups are collapsed',
                collapsedGroups: [1, 2, 3],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: false
            },
            {
                description: 'returns true if any group is collapsed, but not all groups',
                collapsedGroups: [1],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: true
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.areSomeCollapsed()).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('areNoneCollapsed', () => {
        let testCases = [
            {
                description: 'returns false if any group is collapsed',
                collapsedGroups: [2],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: false
            },
            {
                description: 'returns false if all groups are collapsed',
                collapsedGroups: [1, 2, 3],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: false
            },
            {
                description: 'returns true if ' +
                '' +
                '' +
                'there are no collapsed groups',
                collapsedGroups: [],
                rows: [{id: 1, isSubHeader: true}, {id: 2, isSubHeader: true}, {id: 3, isSubHeader: true}, {id: 4}],
                expectedValue: true
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.areNoneCollapsed()).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('getSubHeaderRows', () => {
        let testCases = [
            {
                description: 'gets all subheader rows',
                collapsedGroups: [1, 2],
                rows: [{id: 1, isSubHeader: false}, {id: 2, isSubHeader: true}, {id: 3}, {id: 4, isSubHeader: true}],
                shouldReset: false,
                expectedSubHeaderRows: [{id: 2, isSubHeader: true}, {id: 4, isSubHeader: true}],
                expectedCollapsedGroups: [1, 2]
            },
            {
                description: 'does not reset the collapsed groups if the row data has not changed',
                collapsedGroups: [1, 2],
                rows: [{id: 1, isSubHeader: false}, {id: 2, isSubHeader: true}, {id: 3}, {id: 4, isSubHeader: true}],
                shouldReset: true,
                expectedSubHeaderRows: [{id: 2, isSubHeader: true}, {id: 4, isSubHeader: true}],
                expectedCollapsedGroups: [1, 2]
            },
            {
                description: 'rests the collapsed groups if shouldReset is true and the number of subHeaders has changed',
                collapsedGroups: [1, 2],
                rows: [{id: 1, isSubHeader: false}, {id: 2, isSubHeader: true}, {id: 3}, {id: 4, isSubHeader: true}],
                addRows: [{id: 5, isSubHeader: true}],
                shouldReset: true,
                expectedSubHeaderRows: [{id: 2, isSubHeader: true}, {id: 4, isSubHeader: true}, {id: 5, isSubHeader: true}],
                expectedCollapsedGroups: []
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);

                if (testCase.addRows) {
                    collapsedGroupHelper.rows = [...testCase.rows, ...testCase.addRows];
                }

                expect(collapsedGroupHelper.getSubHeaderRows(testCase.shouldReset)).toEqual(testCase.expectedSubHeaderRows);
                expect(collapsedGroupHelper.subHeaderRows).toEqual(testCase.expectedSubHeaderRows);
                expect(collapsedGroupHelper.collapsedGroups).toEqual(testCase.expectedCollapsedGroups);
            });
        });
    });

    describe('filterRows', () => {
        let testCases = [
            {
                description: 'filters out any rows that have been collapsed',
                rows: [{id: 1, parentId: 'a'}, {id: 2, parentId: 'b'}, {id: 3}, {id: 4, parentId: 'a'}],
                collapsedGroups: ['a'],
                expectedSubHeaderRows: [],
                expectedValue: [{id: 2, parentId: 'b'}, {id: 3}]
            },
            {
                description: 'sets isCollapsed property on any subheaders so the collapse icon can be updated (true for subHeaders that have been collapsed)',
                rows: [{id: 1, parentId: 'a'}, {id: 2, parentId: 'b'}, {id: 3}, {id: 4, parentId: 'a', isSubHeader: true}, {id: 'a', isSubHeader: true}],
                collapsedGroups: ['a'],
                expectedSubHeaderRows: [{id: 4, parentId: 'a', isSubHeader: true, isCollapsed: false}, {id: 'a', isSubHeader: true, isCollapsed: true}],
                expectedValue: [{id: 2, parentId: 'b'}, {id: 3}, {id: 'a', isSubHeader: true, isCollapsed: true}]
            },
            {
                description: 'returns an empty array if no rows are passed in',
                rows: null,
                collapsedGroups: ['a'],
                expectedSubHeaderRows: [],
                expectedValue: []
            },
            {
                description: 'returns unfiltered rows if no rows have been collapsed',
                rows: [{id: 1, parentId: 'a'}, {id: 2, parentId: 'b'}, {id: 3}, {id: 4, parentId: 'a'}],
                collapsedGroups: [],
                expectedSubHeaderRows: [],
                expectedValue: [{id: 1, parentId: 'a'}, {id: 2, parentId: 'b'}, {id: 3}, {id: 4, parentId: 'a'}]
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.filterRows(testCase.rows)).toEqual(testCase.expectedValue);
                expect(collapsedGroupHelper.subHeaderRows).toEqual(testCase.expectedSubHeaderRows);
            });
        });
    });

    describe('addSubGroups', () => {
        let testCases = [
            {
                description: 'returns the current subHeaderId',
                subHeaderId: 'a',
                rows: [{id: 'a', isSubHeader: true}, {id: '1'}],
                expectedValue: ['a']
            },
            {
                description: 'returns any headers that are nested in the current subHeader (assumes flattened array is ordered with parent above child rows)',
                subHeaderId: 'a',
                rows: [{id: 'a', isSubHeader: true}, {id: 1, parentId: 'a'}, {id: 'b', isSubHeader: true, parentId: 'a'}, {id: 'c', isSubHeader: true, parentId: 'b'}, {id: 'd', isSubHeader: true, parentId: 'e'}],
                expectedValue: ['a', 'b', 'c']
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper([], testCase.rows);
                expect(collapsedGroupHelper.addSubGroups(testCase.subHeaderId)).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('toggleCollapseGroup', () => {
        let testCases = [
            {
                description: 'adds the subHeaderId if collapsedGroups is empty',
                subHeaderId: 'c',
                collapsedGroups: [],
                expectedValue: ['c']
            },
            {
                description: 'adds the subHeaderId if it does not already exist in the collapsedGroups array',
                subHeaderId: 'c',
                collapsedGroups: ['a', 'b'],
                expectedValue: ['a', 'b', 'c']
            },
            {
                description: 'removes the subHeaderId if it already exists in the collapsedGroups array',
                subHeaderId: 'c',
                collapsedGroups: ['a', 'b', 'c'],
                expectedValue: ['a', 'b']
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, []);
                expect(collapsedGroupHelper.toggleCollapseGroup(testCase.subHeaderId)).toEqual(testCase.expectedValue);
                expect(collapsedGroupHelper.collapsedGroups).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('toggleCollapseAllGroups', () => {
        let testCases = [
            {
                description: 'de-collapses all subHeader groups if all groups are currently collapsed',
                collapsedGroups: ['a', 'b'],
                rows: [{id: 'a', isSubHeader: true}, {id: 1}, {id: 'b', isSubHeader: true}, {id: 2}],
                expectedValue: []
            },
            {
                description: 'collapses all subHeaderGroups if no groups are collapsed',
                collapsedGroups: [],
                rows: [{id: 'a', isSubHeader: true}, {id: 1}, {id: 'b', isSubHeader: true}, {id: 2}],
                expectedValue: ['a', 'b']
            },
            {
                description: 'expands all subHeaderGroups if some, but not all, groups are collapsed',
                collapsedGroups: ['a'],
                rows: [{id: 'a', isSubHeader: true}, {id: 1}, {id: 'b', isSubHeader: true}, {id: 2}],
                expectedValue: []
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let collapsedGroupHelper = new CollapsedGroupHelper(testCase.collapsedGroups, testCase.rows);
                expect(collapsedGroupHelper.toggleCollapseAllGroups()).toEqual(testCase.expectedValue);
                expect(collapsedGroupHelper.collapsedGroups).toEqual(testCase.expectedValue);
            });
        });
    });
});
