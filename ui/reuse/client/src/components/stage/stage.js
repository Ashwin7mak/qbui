import React, {PropTypes, Component} from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import Icon from '../icon/icon';

import './stage.scss';

/**
 * The stage is a header element that appears at the top of most pages. It has a headline (left) and page-wide actions (right).
 * Optionally, it can have children that appear when the expand/collapse button is clicked.
 * <Stage>
 *     <p>Content that will appear when expand is clicked</p>
 * </Stage>
 */
class Stage extends Component {
    constructor(props) {
        super(props);

        this.state = {open: false};

        this.toggleStage = this.toggleStage.bind(this);
    }

    toggleStage() {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <div className="layout-stage">
                <div className="stageHeader">
                    <div className="stageLeft">
                        {this.props.stageHeadline}
                    </div>
                    <div className="stageRight pageActions">
                        {this.props.pageActions}
                    </div>
                </div>
                
                <Collapse in={this.state.open}>
                    <Well>{this.props.children}</Well>
                </Collapse>

                <button className="toggleStage" onClick={this.toggleStage}><Icon icon={this.state.open ? 'caret-up' : 'caret-down'} /></button>
            </div>
        );
    }
}

Stage.propTypes = {
    /**
     * Page actions that appear on the right side of the page. It's easiest to pass in a IconActions component, but not required. */
    pageActions: PropTypes.element,

    /**
     * The title/headline of the stage. It appears toward the upper-left of the stage. */
    stageHeadline: PropTypes.node
};

export default Stage;
