import React, {PropTypes, Component} from 'react';

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

    }

    renderNewFields = () => {
        return (
            <ul className="toolPaletteList toolPaletteNewFields">
                {SUPPORTED_FIELD_TYPES.map((fieldType, index) => (
                    <li className="toolPaletteItem" key={fieldType.key || index}>
                        <FieldTokenInMenu {...createFieldTypeProps(fieldType)} isCollapsed={this.props.isCollapsed} />
                    </li>
                ))}
            </ul>
        );
    };

    renderToolPalette = () => {
        return (
            <div className="toolPaletteContainer">
                {this.renderNewFields()}
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
