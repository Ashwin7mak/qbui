import React, {PropTypes, Component} from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import Icon from 'REUSE/components/icon/icon';

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

        this.state = {open: props.isOpenOnMount};

        this.toggleStage = this.toggleStage.bind(this);
    }

    toggleStage() {
        this.setState({open: !this.state.open});
    }

    render() {
        let classes = "layout-stage";
        classes += this.props.className ? " " + this.props.className : "";
        return (
            <div className={classes}>
                <div className="stageHeader">
                    <div className="stageLeft">
                        {this.props.stageHeadline}
                    </div>
                    <div className="stageRight pageActions">
                        {this.props.drawerAction}
                        {this.props.pageActions}
                    </div>
                </div>

                <Collapse in={this.state.open}>
                    <Well className="collapsedContent">{this.props.children}</Well>
                </Collapse>

                {
                    this.props.children &&
                    <button className="toggleStage" onClick={this.toggleStage}><Icon icon={this.state.open ? 'caret-up' : 'caret-down'} /></button>
                }
            </div>
        );
    }
}

Stage.defaultProps = {
    isOpenOnMount: false
};

Stage.propTypes = {
    /**
     * Page actions that appear on the right side of the page. It's easiest to pass in a IconActions component, but not required. */
    pageActions: PropTypes.element,

    /**
     * The title/headline of the stage. It appears toward the upper-left of the stage. It's easiest to use the StageHeaderComponent, but not required. */
    stageHeadline: PropTypes.node,

    /**
     * Tells the stage whether it should be open or close by default
     */
    isOpenOnMount: PropTypes.bool
};

export default Stage;
