import React, {Component} from 'react';
import _ from 'lodash';
import DraggableField from './draggableField';
import DroppableFormElement from './droppableFormElement';

/**
 * This HOC is a convenience method to wrap a field in both a drag and drop source.
 * @param FieldComponent
 * @param showFieldEditingTools
<<<<<<< HEAD
 * @returns {*}
 */
export default (FieldComponent, showFieldEditingTools) => {
=======
 * @param isFieldDeletable
 * @returns {*}
 */
export default (FieldComponent, showFieldEditingTools, isFieldDeletable) => {
>>>>>>> parent of 4665f21... Revert "Merge remote-tracking branch 'origin/e2e-enter-reportbuilder' into e2e-enter-reportbuilder"
    // This must be a component that could have state to work with drag/drop animations.
    // It cannot be a stateless component built with a function.
    class DragDropFieldComponent extends Component {
        render() {
            return (
                <div className="dragAndDropField">
                    <FieldComponent {...this.props} />
                </div>
            );
        }
    }

    return _.flow([
        DraggableField,
        DroppableFormElement
<<<<<<< HEAD
    ])(DragDropFieldComponent, showFieldEditingTools);
=======
    ])(DragDropFieldComponent, showFieldEditingTools, isFieldDeletable);
>>>>>>> parent of 4665f21... Revert "Merge remote-tracking branch 'origin/e2e-enter-reportbuilder' into e2e-enter-reportbuilder"
};
