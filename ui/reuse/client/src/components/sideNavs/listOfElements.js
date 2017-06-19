import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import FlipMove from 'react-flip-move';
import Locale from 'REUSE/locales/locale';

// IMPORT FROM CLIENT REACT
import SearchBox from 'APP/components/search/searchBox';
// IMPORT FROM CLIENT REACT

import './listOfElements.scss';

const FILTER_DEBOUNCE_TIMEOUT = 100;

/**
 * Displays a list of elements that can be filtered.
 * This component is typically used to display fields that can be added to a form.
 */
class ListOfElements extends Component {
    constructor(props) {
        super(props);
        this.listOfElementsContainer = null;
        this.state = {
            // Stores the current value of the filter input
            fieldFilter: '',

            // The filter taking place is debounced. This value contains the actively applied filter, which
            // may be different from the fieldFilter until the debounce elapses
            activeFieldFilter: ''
        };
    }

    onChangeFilter = (evt) => {
        this.setState({fieldFilter: evt.target.value});
        this.updateFieldFilter();
    };

    clearFilter = () => {
        this.setState({fieldFilter: '', activeFieldFilter: ''});
    };

    /**
     * Updating the filtered list of elements in debounced so that if someone types really quicklys,
     * the animations that occur during filter won't flash. Also, improves performance of filter.
     * @type {*}
     */
    updateFieldFilter = _.debounce(() => this.setState({activeFieldFilter: this.state.fieldFilter}), FILTER_DEBOUNCE_TIMEOUT);

    /**
     * Takes the grouped list of elements and flattens them into a single list for filtering */
    flattenedElements = () => {
        return this.props.elements.reduce((elements, element) => {
            if (element.children) {
                return [
                    ...elements,
                    ...element.children
                ];
            } else {
                return [
                    ...elements,
                    element
                ];
            }
        }, []);
    };

    renderFilteredFieldsList = () => {
        let elements = this.flattenedElements().filter(element => {
            // Filter out anything that isn't a string
            if (!_.isString(element.title)) {
                return false;
            }
            return element.title.toLowerCase().indexOf(this.state.activeFieldFilter.toLowerCase()) >= 0;
        });

        if (elements.length === 0) {
            return (
                <li key="emptySearchResults">
                    <p className="emptySearchResult">
                        {Locale.getMessage('listOfElements.noSearchResults', {searchText: this.state.fieldFilter})}
                    </p>
                </li>
            );
        }

        return this.renderElements(elements);
    };

    /**
     * Displays the fields within a group in SUPPORTED_NEW_FIELD_TYPES
     * @param childElements
     */
    renderElements = (childElements) => {
        if (childElements) {
            return childElements.map((childElement, index) => {
                // If the element has a specific renderer, use that. Otherwise, use the default renderer passed in.
                let ElementRenderer = childElement.alternateRenderer || this.props.renderer;

                return (
                    <li key={childElement.key || index} className="listOfElementsItem">
                        <ElementRenderer
                            {...childElement}
                            isCollapsed={this.props.isCollapsed}
                            tabIndex={this.props.childrenTabIndex}
                        />
                    </li>
                );
            });
        }
    };

    /**
     * Takes the SUPPORTED_NEW_FIELD_TYPES constant and maps them to a displayed list of grouped field types
     * @returns {XML}
     */
    renderElementGroups = () => {
        // Return a filtered list without groups if there is a filter active
        if (this.state.activeFieldFilter) {
            return this.renderFilteredFieldsList();
        }
        if (this.props.elements && this.props.elements.length > 0) {
            return this.props.elements.map((element, index) => {
                if (element.children) {
                    return (
                        <li key={element.key || `group_${index}`} className="listOfElementsItemGroup">
                            {!this.props.hideTitle && <h6 className="listOfElementsItemHeader">{element.title}</h6>}
                            {this.props.animateChildren ?
                                <FlipMove typeName="ul" className="animatedListOfElementsItemList">
                                    {this.renderElements(element.children)}
                                </FlipMove> :
                                <ul className="listOfElementsItemList">
                                    {this.renderElements(element.children)}
                                </ul>
                            }
                        </li>
                    );
                }
                return this.renderElements([element]);
            });
        } else {
            return (
                <li key="emptyStateMessage" className="emptyStateMessage">
                    {this.props.emptyMessage}
                </li>
            );
        }
    };

    componentDidUpdate() {
        if (this.props.hasKeyBoardFocus &&
            document.activeElement.classList[0] !== "checkbox" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "BUTTON") {
            this.listOfElementsContainer.focus();
        }
    };

    render() {
        return (
            <div className={`listOfElementsContainer ${this.props.isCollapsed ? 'listOfElementsCollapsed' : ''}`}
                 tabIndex={this.props.tabIndex}
                 onKeyDown={this.props.toggleChildrenTabIndex}
                 ref={(element) => {this.listOfElementsContainer = element;}}
                 role="button">
                <SearchBox
                    tabIndex={this.props.childrenTabIndex}
                    value={this.state.fieldFilter}
                    onChange={this.onChangeFilter}
                    placeholder={Locale.getMessage('listOfElements.searchPlaceholder')}
                    onClearSearch={this.clearFilter}
                />

                <FlipMove typeName="ul" className="listOfElementsMainList">
                    {this.renderElementGroups()}
                </FlipMove>
            </div>
        );
    }
}

ListOfElements.defaultProps = {
    animateChildren: false
};

ListOfElements.propTypes = {
    /**
     * Show the list of elements in a collapsed state */
    isCollapsed: PropTypes.bool,
    /**
     * Wraps children in flipmove it is true */
    animateChildren: PropTypes.bool,

    /**
     * Show the list of elements in an open state */
    isOpen: PropTypes.bool,

    /**
     * Hide the title of a group of elements */
    hideTitle: PropTypes.bool,

    /**
     * Displays the filter box at the top of the menu */
    isFilterable: PropTypes.bool,

    /**
     * Tokens are being passed in as a renderer to allow this component to be reusable */
    renderer: PropTypes.func,

    /**
     * For Keyboard Nav: tabIndex for listOfElements */
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * For Keyboard Nav: if true it will set focus on listOfElements */
    hasKeyBoardFocus: PropTypes.bool,

    /**
     * For Keyboard Nav: tabIndex for the children elements inside of listOfElements*/
    childrenTabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * For Keyboard Nav: This functions toggles listOfElements children's tabIndices, to add or remove it
     * from the tabbing flow. */
    toggleChildrenTabIndex: PropTypes.func,

    /**
     * A list of grouped elements to be displayed in the menu. */
    elements: PropTypes.arrayOf(PropTypes.shape({
        /**
         * A unique key so that React can find this element in an array. Helps improve animations if the key
         * is unique and constant for the element (i.e., not an 'index' in a forEach) */
        key: PropTypes.string,

        /**
         * The text to display for the field type. This property will be used for filtering. It should be localized. */
        title: PropTypes.string.isRequired,

        /**
         * Optional: Any child elements that should be displayed in a group.
         * If it has this property, this element will be displayed as a group header. */
        children: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            title: PropTypes.string.isRequired,

            /**
             * Most items in the list will use the defaulter render (from renderer props). But some special types may need
             * there own renderer. You can specify that renderer here and it will take precedence over the renderer prop. */
            alternateRenderer: PropTypes.func,

            // Other props will be passed through the to the rendering component
        }))
    }))
};

export default ListOfElements;
