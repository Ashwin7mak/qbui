import React, {PropTypes, Component} from 'react';
import ElementToken from './elementToken';
import Tooltip from '../../tooltip/tooltip';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 */
export class TokenInMenu extends Component {
    render() {
        const elementToken = <ElementToken isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <div >
                    <Tooltip location="right" plainMessage={this.props.tooltipText}>
                        {elementToken}
                    </Tooltip>
                </div>
            );
        }

        return elementToken;
    }
}

TokenInMenu.propTypes = {
    /**
     * What field type does this token represent? */
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * What title should be used on the field token? */
    title: PropTypes.string.isRequired,

    /**
     * Text to display in a tooltip. It should be localized. */
    tooltipText: PropTypes.string,

    /**
     * Can optionally show the token in a collapsed state (icon only) */
    isCollapsed: PropTypes.bool,

    /**
     * Tabindex */
    toolPaletteChildrenTabIndex: PropTypes.number
};

export default TokenInMenu;
