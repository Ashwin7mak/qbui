import React, {PropTypes, Component} from 'react';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';
import NewFieldsMenu from '../../formBuilder/menus/newFieldsMenu';
import * as tabIndexConstants from '../../formBuilder/tabindexConstants';
import _ from 'lodash';
import './toolPalette.scss';

/**
 * Displays a list of new field types that can be added to the form.
 * TODO: Extend to allow existing fields to be shown as well.
 */
class ToolPalette extends Component {
    renderToolPalette = () => {
        const {isCollapsed, isOpen} = this.props;

        return (
            <div className="toolPaletteContainer">
                <NewFieldsMenu isCollapsed={isCollapsed} isOpen={isOpen}
                               toolPaletteTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                               toggleToolPaletteChildrenTabIndex={this.props.toggleToolPaletteChildrenTabIndex}
                               toolPaletteChildrenTabIndex={this.props.toolPaletteChildrenTabIndex}
                               toolPaletteFocus={this.props.toolPaletteFocus}
                               formMeta={this.props.formMeta}
                               tables={_.get(this.props, "app.tables", [])}
                />
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
     * Display the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Display the menu is an open state (only affects small breakpoint) */
    isOpen: PropTypes.bool,
};

export default ToolPalette;
