import React, {PropTypes, Component} from 'react';
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 */
export class FieldTokenInMenu extends Component {
    render() {
        const fieldToken = <FieldToken isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <div >
                    <Tooltip location="right" plainMessage={this.props.tooltipText}>
                        {fieldToken}
                    </Tooltip>
                </div>
            );
        }

        return fieldToken;
    }
}

FieldTokenInMenu.propTypes = {
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

export default FieldTokenInMenu;
