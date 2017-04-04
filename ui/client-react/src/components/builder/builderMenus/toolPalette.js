import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import FlipMove from 'react-flip-move';
import Locale from '../../../../../reuse/client/src/locales/locale';

import FieldTokenInMenu from '../../formBuilder/fieldToken/fieldTokenInMenu';
import {supportedNewFieldTypesWithProperties} from '../../formBuilder/newFieldTypes';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';
import SearchBox from '../../search/searchBox';

import './toolPalette.scss';

const FILTER_DEBOUNCE_TIMEOUT = 100;

/**
 * Displays a list of new field types that can be added to the form.
 * TODO: Extend to allow existing fields to be shown as well.
 */
class ToolPalette extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Stores the current value of the filter input
            fieldFilter: '',

            // The filter taking place is debounced. This value contains the actively applied filter, which
            // may be different from the fieldFilter until the debounce elapses
            activeFieldFilter: ''
        };
    }

    onChangeFieldFilter = (evt) => {
        this.setState({fieldFilter: evt.target.value});
        this.updateFieldFilter();
    };


    updateFieldFilter = _.debounce(() => this.setState({activeFieldFilter: this.state.fieldFilter}), FILTER_DEBOUNCE_TIMEOUT);

    renderFilteredFieldsList = () => {
        let fieldTypes = supportedNewFieldTypesWithProperties().reduce((allFieldTypes, fieldGroup) => [...allFieldTypes, ...fieldGroup.fieldTypes], []).filter(fieldType => {
            // Filter out anything that isn't a string
            if (!_.isString(fieldType.title)) {
                return false;
            }

            return fieldType.title.toLowerCase().indexOf(this.state.activeFieldFilter.toLowerCase()) >= 0;
        });

        if (fieldTypes.length === 0) {
            return <li key="emptySearchResults"><p className="emptySearchResult">{Locale.getMessage('builder.noSearchResultsInToolPalette', {searchText: this.state.fieldFilter})}</p></li>;
        }

        return this.renderNewFieldTypes(fieldTypes);
    };

    /**
     * Displays the fields within a group in SUPPORTED_NEW_FIELD_TYPES
     * @param fieldTypes
     */
    renderNewFieldTypes = (fieldTypes) => {
        return fieldTypes.map((fieldType, index) => (
            <li key={fieldType.key || index} className="toolPaletteItem">
                <FieldTokenInMenu {...fieldType} isCollapsed={this.props.isCollapsed} />
            </li>
        ));
    };

    /**
     * Takes the SUPPORTED_NEW_FIELD_TYPES constant and maps them to a displayed list of grouped field types
     * @returns {XML}
     */
    renderNewFieldGroups = () => {
        // Return a filtered list without groups if there is a filter active
        if (this.state.activeFieldFilter) {
            return this.renderFilteredFieldsList();
        }

        return supportedNewFieldTypesWithProperties().map((group, index) => (
            <li key={index} className="toolPaletteItemGroup">
                <h6 className="toolPaletteItemHeader">{Locale.getMessage(group.titleI18nKey)}</h6>

                <ul className="toolPaletteItemList">
                    {this.renderNewFieldTypes(group.fieldTypes)}
                </ul>
            </li>
        ));
    };

    renderToolPalette = () => {
        return (
            <div className={`toolPaletteContainer ${this.props.isCollapsed ? 'toolPaletteCollapsed' : ''}`}>
                <SearchBox
                    value={this.state.fieldFilter}
                    onChange={this.onChangeFieldFilter}
                    placeholder={Locale.getMessage('builder.searchToolPalette')}
                />

                <FlipMove typeName="ul" className="toolPaletteList toolPaletteNewFields">
                    {this.renderNewFieldGroups()}
                </FlipMove>
            </div>
        );
    };

    render() {
        return (
            <SideTrowser
                sideMenuContent={this.renderToolPalette()}
                isCollapsed={this.props.isCollapsed}
                isOpen={this.props.isOpen}
            >
                {this.props.children}
            </SideTrowser>
        );
    }
}

ToolPalette.propTypes = {
    /**
     * Show the tool palette in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Show the tool palette in an open state */
    isOpen: PropTypes.bool,
};

export default ToolPalette;
