import React, {PropTypes, Component} from 'react';
import {DragLayer} from 'react-dnd';
import draggableItemTypes from './draggableItemTypes';
import FieldToken from './fieldToken/fieldToken';
import Locale from '../../locales/locales';
import consts from '../../../../common/src/constants';

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

    const transform = `translate(${x - 17}px, ${y - 17}px)`;

    return {
        transform,
        WebkitTransform: transform
    };
}

export class FormBuilderCustomDragLayer extends Component {
    renderItem(type, item) {
        let fieldType = (_.has(item, 'relatedField.datatypeAttributes.type') ? item.relatedField.datatypeAttributes.type : consts.TEXT);
        let label = (_.has(item, 'relatedField.name') ? item.relatedField.name : Locale.getMessage(`builder.fields.${fieldType}`));

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
