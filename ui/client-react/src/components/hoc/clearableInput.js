import React from 'react';

import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';

/**
 * A higher-order component which adds a "clear" icon to the wrapped component.
 */
// const ClearableInputWrapper = (component) => {
//     const ClearableInput = React.createClass({
//
//         //let classNames = ['inputDeleteIcon'];
//         render() {
//             return (
//                 <span className={"inputDeleteIcon"}>
//                     <Component {...this.props} />
//                     <div className="clearIcon">
//                         <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
//                             <QBicon onClick={component.clearInput} icon="clear-mini" />
//                         </QBToolTip>
//                     </div>
//                 </span>
//             );
//         }
//     });
// };


const ClearableInputWrapper = React.createClass({
    displayName: 'ClearableInputWrapper',

    propTypes: {
        clearInput  : React.PropTypes.func,
    },

    render() {
        return (
            <span className="inputDeleteIcon">
                {this.props.children}
                <div className="clearIcon">
                    <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
                        <QBicon onClick={this.props.clearInput} icon="clear-mini" />
                    </QBToolTip>
                </div>
            </span>
        );
    }
});
export default ClearableInputWrapper;
