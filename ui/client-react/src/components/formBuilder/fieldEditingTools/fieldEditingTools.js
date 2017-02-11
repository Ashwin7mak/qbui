import React, {PropTypes, Component} from 'react';
import QbIcon from '../qbIcon/qbIcon';
import QbToolTip from '../qbToolTip/qbToolTip';
import DragHandle from './dragHandle/dragHandle';

class FieldEditingTools extends Component {
    componentDidMount() {
        this.setPositionOfFieldEditingTools();
    }

    getInitialState() {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '250px',
            width: '250px',
            zIndex: 0
        };
    }

    setPositionOfFieldEditingTools(editingTools) {
        if (editingTools) {
            let fieldDomElement = ReactDom.findDOMNode(editingTools).nextElementSibling;
            let styles = {
                top: `${fieldDomElement.offsetTop - 10}px`,
                left: `${fieldDomElement.offsetLeft - 20}px`,
                height: `${fieldDomElement.offsetHeight + 26}px`,
                width: `${fieldDomElement.offsetWidth + 40}px`
            };
            this.setState(Object.assign({}, this.state, styles));
        }
    }

    render() {
        return (
            <div
                className="editingTools"
                ref={this.setPositionOfFieldEditingTools}
                style={this.state}
            >
                <DragHandle />
                <div className="deleteFieldIcon">
                    <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                        <QbIcon icon="delete" />
                    </QbToolTip>
                </div>
            </div>
        );
    }
}
