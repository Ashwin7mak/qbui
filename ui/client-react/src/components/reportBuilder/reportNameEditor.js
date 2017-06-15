import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {CONTEXT} from '../../actions/context';
import {changeReportName} from '../../actions/reportBuilderActions';
import TextFieldValueEditor from '../fields/textFieldValueEditor';

/**
 * Editable text field for a report name.
 */
export class ReportNameEditor extends Component {
    constructor(props) {
        super(props);

    }

    updateName = (name) => {
        this.props.changeReportName(CONTEXT.REPORT.NAV, name);
    };

    render() {
        let name = this.props.name || '';
        return (
            <div className="reportNameEditor">
            {this.props.isInBuilderMode ?
                <div className="editor">
                    <h3>
                        <TextFieldValueEditor
                            className="editableReportName"
                            value={name}
                            inputType="text"
                            onChange={this.updateName}
                        />
                    </h3>
                </div> : <h3 className="nonEditableReportName">{name}</h3>
            }
            </div>
        );
    }
}

ReportNameEditor.propTypes = {
    /**
     * Name of the report */
    name: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        isInBuilderMode: state.reportBuilder.isInBuilderMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeReportName: (context, newName) => {
            dispatch(changeReportName(context, newName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportNameEditor);
