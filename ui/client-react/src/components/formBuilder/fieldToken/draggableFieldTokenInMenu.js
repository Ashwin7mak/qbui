import React, {PropTypes, Component} from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from '../draggableItemTypes';
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';

const fieldSource = {
    beginDrag(props) {
        return {};
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class DraggableFieldTokenInMenu extends Component {
    render() {
        const { connectDragSource, isDragging } = this.props;

        const fieldToken =
            <div style={{opacity: isDragging ? 0 : 1, cursor: 'move'}}>
                <FieldToken isDragging={isDragging} {...this.props} />
            </div>;

        if (this.props.tooltipText) {
            return connectDragSource(
                <div style={{opacity: isDragging ? 0 : 1, cursor: 'move'}}>
                    <Tooltip location="right" plainMessage={this.props.tooltipText}>
                        {fieldToken}
                    </Tooltip>
                </div>
            );
        }

        return connectDragSource(fieldToken);
    }
}

DraggableFieldTokenInMenu.propTypes = {
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

    connectDragSource: PropTypes.func.isRequired,

    isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.FIELD, fieldSource, collect)(DraggableFieldTokenInMenu);
