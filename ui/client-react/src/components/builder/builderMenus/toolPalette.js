import React, {PropTypes, Component} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';

import FieldTokenInMenu from '../../formBuilder/fieldToken/fieldTokenInMenu';
import {SUPPORTED_FIELD_TYPES, createFieldTypeProps} from '../../formBuilder/newFieldTypes';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';

import './toolPalette.scss';

/**
 * Displays a list of new field types that can be added to the form.
 * TODO: Extend to allow existing fields to be shown as well.
 */
class ToolPalette extends Component {
    constructor(props) {
        super(props);

        this.renderNewFieldTypes = this.renderNewFieldTypes.bind(this);
        this.renderNewFieldGroups = this.renderNewFieldGroups.bind(this);
        this.renderToolPalette = this.renderToolPalette.bind(this);
    }

    /**
     * Displays the fields within a group in SUPPORTED_FIELD_TYPES
     * @param fieldTypes
     */
    renderNewFieldTypes(fieldTypes) {
        return fieldTypes.map((fieldType, index) => (
            <li key={index} className="toolPaletteItem">
                <FieldTokenInMenu {...createFieldTypeProps(fieldType)} isCollapsed={this.props.isCollapsed} />
            </li>
        ));
    }

    /**
     * Takes the SUPPORTED_FIELD_TYPES constant and maps them to a displayed list of grouped field types
     * @returns {XML}
     */
    renderNewFieldGroups() {
        return (
            <ul className={`toolPaletteList toolPaletteNewFields ${this.props.isCollapsed ? 'toolPaletteCollapsed' : ''}`}>
                {SUPPORTED_FIELD_TYPES.map((group, index) => (
                    <li key={index} className="toolPaletteItemGroup">
                        <h6 className="toolPaletteItemHeader">{Locale.getMessage(group.titleI18nKey)}</h6>

                        <ul className="toolPaletteItemList">

                            {this.renderNewFieldTypes(group.fieldTypes)}
                        </ul>
                    </li>
                ))}
            </ul>
        );
    };

    renderToolPalette() {
        return (
            <div className="toolPaletteContainer">
                {this.renderNewFieldGroups()}
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
