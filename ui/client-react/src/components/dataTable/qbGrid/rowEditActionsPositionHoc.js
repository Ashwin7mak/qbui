import React from 'react';

export const calculatePosition = (parentHeight, parentWidth, componentHeight, componentWidth, styles) => {
    let middleOfComponent = componentHeight / 2;
    let middleOfParentComponent = parentHeight / 2;

    let stylesWithPosition = Object.assign({}, styles);
    stylesWithPosition.top = (middleOfComponent - middleOfParentComponent) * -1;
    stylesWithPosition.left = parentWidth - componentWidth;

    return Object.assign({}, styles, stylesWithPosition);
};


/**
 * This HOC is used within QbGrid to absolutely position the RowEditActions component next to the currently editing row.
 * It is split from the standard presentational logic of displaying some RowEditAction buttons so that component could be reused elsewhere if needed without the positioning for the grid.
 * We also want to keep components that use ref and state contained.
 * @type {__React.ClassicComponentClass<P>}
 */
function positionRowEditActions(RowEditActionsComponent) {
    return React.createClass({
        getInitialState() {
            return {
                styles: {
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    zIndex: 1,
                }
            };
        },

        componentDidMount() {
            let component = this.refs.rowEditActionsWrapper;
            // We can assume the top of the component is at 0 (the top of the containing cell in the grid)
            // So we need to move the center of this element to the center of the cell to get the T shape relative to the row.
            // To align the centers of this element and the containing cell, we get difference between the centers of both elements
            // so we can move this element up by that amount to align the vertical centers.
            this.setState({styles: calculatePosition(
                component.parentElement.offsetHeight,
                component.parentElement.offsetWidth,
                component.offsetHeight,
                component.offsetWidth,
                this.state.styles
            )});
        },

        render() {
            return (
                <div ref="rowEditActionsWrapper" className="rowEditActions" style={this.state.styles}>
                    <RowEditActionsComponent {...this.props} />
                </div>
            );
        }
    });
}

export default positionRowEditActions;
