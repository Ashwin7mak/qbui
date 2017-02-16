import React from 'react';

const dateEditor = ({ props } = {}) => {
    const DateEditor = ({ value, onValue }) => {

        const onKeyUp = ({key, target: {value}}) => {
            if (key === 'Enter') {
                onValue(value);
            }
        };
        const onBlur = ({target: {value}}) => {
            onValue(value);
        };

        return (
            <div {...props}>
                <input type="date" defaultValue={value} onBlur={onBlur} onKeyUp={onKeyUp}/>
            </div>);
    };

    DateEditor.propTypes = {
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        onValue: React.PropTypes.func
    };

    return DateEditor;
};

export default dateEditor;
