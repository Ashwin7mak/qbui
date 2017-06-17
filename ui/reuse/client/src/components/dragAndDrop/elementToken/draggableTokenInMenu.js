import React, {PropTypes, Component} from 'react';
import TokenInMenu from './tokenInMenu';
import {ENTER_KEY, SPACE_KEY} from '../../keyboardShortcuts/keyCodeConstants';
import DraggableElement from '../draggableElement';

const FieldToken = DraggableElement(TokenInMenu);

/**
 * This is a base component that can be composed into custom implementations for dragging specific types of elements
 * on to the form.
 *
 * See DraggableFieldTokenInMenu for the most common implementation for dragging most fields onto a form.
 *
 * A component which allows the field token to be clicked and dragged. The click and drag cannot be on the same element because drag
 * will take precedence over click, making the element un-clickable.
 *
 * In addition, it allows some extra methods to be passed through to the DraggableField component which is
 * not possible if this component only had one layer.
 */
export class DraggableTokenInMenu extends Component {
    constructor(props) {
        super(props);

        /**
         * This state is very particular to this component (i.e., does not need to be in a Redux store)
         * It tracks whether or not the component has been dragged over a droppable element at least once.
         * We can use this method to do something special the first time a user brings an element over to a droppable area
         * (e.g., add the field to the form, then move that element on subsequent hovers).
         * hasAttemptedDrop gets set to true the first time the component is dragged over a droppable element.
         * hasAttemptedDrop gets set to false when dragging has been completed (user dropped the item)
         * @type {{hasAttemptedDrop: boolean}}
         */
        this.state = {
            hasAttemptedDrop: false
        };
    }

    clickToAddToForm = () => {
        if (this.props.onClickToken) {
            this.props.onClickToken(this.props);
        }
    };

    // Calls the clickToAddToForm method when user uses enter or space key.
    onEnterClickToAdd = (e) => {
        if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
            this.clickToAddToForm();
            e.preventDefault();
        }
    };

    /**
     * This is called when the field token is dragged over a droppable target on the form
     * If the item has not been att
     * @param dropTargetProps
     * @param dragItemProps
     */
    onHover = (dropTargetProps, dragItemProps) => {
        if (!this.state.hasAttemptedDrop && this.props.onHoverBeforeAdded) {
            this.setState({hasAttemptedDrop: true});
            return this.props.onHoverBeforeAdded(dropTargetProps, dragItemProps);
        }

        if (this.props.onHover) {
            return this.props.onHover(dropTargetProps, dragItemProps);
        }
    };

    /**
     * It resets the state when dragging is complete so the new field can be added again and
     * fires the endDrag callback if present as a prop.
     */
    endDrag = () => {
        this.setState({hasAttemptedDrop: false});

        if (this.props.endDrag) {
            this.props.endDrag(this.props);
        }
    };

    render() {
        return (
            <div className="fieldTokenInMenuWrapper"
                 onClick={this.clickToAddToForm}
                 tabIndex={this.props.tabIndex}
                 onKeyDown={this.onEnterClickToAdd}>
                <FieldToken
                    {...this.props}
                    beginDrag={this.props.beginDrag}
                    onHover={this.onHover}
                    endDrag={this.endDrag}
                />
            </div>
        );
    }
}

DraggableTokenInMenu.propTypes = {
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
     * Callback that is fired when the token is first picked up for dragging.
     * It receives the element props as the first and only argument.
     * It should return an object which will be available in onHover. */
    startDrag: PropTypes.func,

    /**
     * Callback that is fired when the token is dropped.
     * It receives the element props as the first and only argument. */
    endDrag: PropTypes.func,

    /**
     * Callback that is only fired the first time the token is dragged from the menu on to a valid droppable target.
     * If not provided, onHover will be used instead.
     * It receives the drop target props as the first argument and the dragItem props as the second.
     * Note: Only the object returned from 'startDrag' are available as props. */
    onHoverBeforeAdded: PropTypes.func,

    /**
     * Callback that is fired anytime the token is dragged over a valid droppable area.
     * It receives the drop target props as the first argument and the dragItem props as the second.
     * Note: Only the object returned from 'startDrag' are available as props. */
    onHover: PropTypes.func,

    /**
     * Callback that is fired when the token is clicked or the user presses enter or space while focused on the token.
     * It will receive the element props as the first and only argument. */
    onClickToken: PropTypes.func,

    /**
     * Tabindex */
    toolPaletteChildrenTabIndex: PropTypes.number
};

export default DraggableTokenInMenu;
