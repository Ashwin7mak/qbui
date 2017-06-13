import React, {Component} from 'react';
import {DragLayer} from 'react-dnd';
import FieldFormats from '../../utils/fieldFormats';
import draggableItemTypes from '../../../../reuse/client/src/components/dragAndDrop/draggableItemTypes';
import FieldToken from '../../../../reuse/client/src/components/dragAndDrop/elementToken/elementToken';
import Locale from '../../locales/locales';
import consts from '../../../../common/src/constants';
import Device from '../../utils/device';
import _ from 'lodash';

// Values from elementToken.scss
export const TOKEN_WIDTH = 250;
export const TOKEN_HEIGHT = 30;
export const TOKEN_ICON_WIDTH = 35;
export const DRAG_ITEM_Z_INDEX = 2000; // from customVariables.scss

const layerStyles = {
    cursor: 'move',
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: DRAG_ITEM_Z_INDEX,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
};

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging()
    };
}

function getItemStyles(props) {
    const {currentOffset} = props;

    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    let {x, y} = currentOffset;

    // On small breakpoints, the center of the token is under the mouse. In larger breakpoints, the mouse is on the
    // field token icon
    const shiftTokenX = (Device.isTouch() ? (TOKEN_WIDTH / 2) : (TOKEN_ICON_WIDTH / 2));
    const shiftTokenY = TOKEN_HEIGHT / 2;
    const transform = `translate3d(${x - shiftTokenX}px, ${y - shiftTokenY}px, 0px)`;

    return {
        transform,
        WebkitTransform: transform
    };
}

export class FormBuilderCustomDragLayer extends Component {
    renderItem(type, item) {
        switch (type) {
        case draggableItemTypes.FIELD :
            let fieldType = (_.has(item, 'relatedField.datatypeAttributes') ? FieldFormats.getFormatType(item.relatedField) : consts.TEXT);
            let label = (_.has(item, 'relatedField.name') ? item.relatedField.name : Locale.getMessage(`fieldsDefaultLabels.${fieldType}`));
            // Show the FieldToken in its dragging state. Always dragging as part of customDragLayer so hardcoded to true.
            return (<FieldToken title={label} type={fieldType} isDragging={true} />);
        default :
            return null;
        }
    }

    render() {
        const {item, itemType, isDragging} = this.props;

        if (!isDragging) {
            return null;
        }

        return (
            <div className="customDragPreview" style={layerStyles}>
                <div className="previewContainer" style={getItemStyles(this.props)}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        );
    }
}

export default DragLayer(collect)(FormBuilderCustomDragLayer);
