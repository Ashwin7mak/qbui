import React, {PropTypes, Component} from 'react';
import ReactDom from 'react-dom';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';
import DragHandle from '../dragHandle/dragHandle';

import './fieldEditingTools.scss';

class FieldEditingTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '250px',
            width: '250px',
            zIndex: 0
        };

        this.setPositionOfFieldEditingTools = this.setPositionOfFieldEditingTools.bind(this);
    }

    componentDidMount() {
        this.setPositionOfFieldEditingTools();
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
    };

    onClickDelete() {
        if (this.props.onClickDelete) {
            return this.props.onClickDelete(this.props.tabIndex, this.props.sectionIndex, this.props.orderIndex);
        }
    }

    render() {
        return (
            <div
                className="fieldEditingTools"
                ref={this.setPositionOfFieldEditingTools}
                style={this.state}
            >
                <DragHandle />
                <div className="deleteFieldIcon" onClick={this.onClickDelete}>
                    <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                        <QbIcon icon="delete" />
                    </QbToolTip>
                </div>
            </div>
        );
    }
}

FieldEditingTools.propTypes = {
    tabIndex: PropTypes.number,
    sectionIndex: PropTypes.number,
    orderIndex: PropTypes.number,
    onClickDelete: PropTypes.func
};

export default FieldEditingTools;
