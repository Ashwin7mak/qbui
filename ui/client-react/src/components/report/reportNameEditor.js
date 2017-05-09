import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TextFieldValueEditor from '../fields/textFieldValueEditor';

/**
 * Editable text field for a report name.
 */
class ReportNameEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name) {
            this.setState(() => {
                return {
                    name: nextProps.name,
                }
            })
        }
    }

    updateName = (name) => {
        this.setState(() => {
            return {name}
        });
        this.props.onChangeUpdateName(name);
    };

    render() {
        let inBuilderMode = this.props.reportBuilder.inBuilderMode;
        return (
            <div className="reportNameEditor">
            {inBuilderMode ?
                <div className="editor">
                    <h3>
                        <TextFieldValueEditor
                            value={this.state.name}
                            inputType="text"
                            onChange={this.updateName}
                        />
                    </h3>
                </div>:
                <h3>{this.state.name}</h3>
            }
            </div>
        );
    }
}

ReportNameEditor.propTypes = {
    /**
     * Name of the report */
    name: PropTypes.string,
    /**
     * Callback function that will update the report state with the name change */
    onChangeUpdateName: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder
    }
};

export default connect(mapStateToProps)(ReportNameEditor);
