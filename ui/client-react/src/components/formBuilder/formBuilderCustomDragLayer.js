import React, {PropTypes, Component} from 'react';
import {DragLayer} from 'react-dnd';
import FieldFormats from '../../utils/fieldFormats';
import draggableItemTypes from './draggableItemTypes';
import FieldToken from './fieldToken/fieldToken';
import Locale from '../../locales/locales';
import consts from '../../../../common/src/constants';
import Device from '../../utils/device';
import _ from 'lodash';

// Values from fieldToken.scss
export const TOKEN_WIDTH = 250;
export const TOKEN_HEIGHT = 30;
export const TOKEN_ICON_WIDTH = 35;

const layerStyles = {
    cursor: 'move',
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
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
    const transform = `translate(${x - shiftTokenX}px, ${y - shiftTokenY}px)`;

    return {
        transform,
        WebkitTransform: transform
    };
}

export class FormBuilderCustomDragLayer extends Component {
    renderItem(type, item) {
        let fieldType = (_.has(item, 'relatedField.datatypeAttributes') ? FieldFormats.getFormatType(item.relatedField) : consts.TEXT);
        let label = Locale.getMessage(`builder.fields.${fieldType}`) || item.relatedField.name || '';
        switch (type) {
        case draggableItemTypes.FIELD :
            return (<FieldToken title={label} type={fieldType} />);
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
