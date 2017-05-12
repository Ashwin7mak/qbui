import React, {PropTypes} from 'react';
import './iconInputBox.scss';
import Icon from 'REUSE/components/icon/icon';
/**
 * Generic component that renders a search box
 */
const IconInputBox = React.createClass({
    propTypes: {
        className: PropTypes.string,
        icon: PropTypes.string,
        iconInputBoxKey: PropTypes.string,
        placeholder: PropTypes.string,
        hideClearIcon: PropTypes.bool, //if the box chooses to not render clear icon
        onChange: PropTypes.func,
        onClear: PropTypes.func,
        value: PropTypes.string
    },
    getDefaultProps() {
        return {
            icon: "search",
            hideClearIcon: false
        };
    },
    render: function() {
        let className = "searchInputBox ";
        className += (this.props.className ? this.props.className : "");
        return (
            <div className={className}>
                <input className="searchInput" type="text"
                   tabIndex={this.props.tabIndex}
                   key={this.props.iconInputBoxKey}
                   value={this.props.value}
                   onChange={this.props.onChange}
                   placeholder={this.props.placeholder}>
                </input>
                {this.props.value && this.props.value.length && !this.props.hideClearIcon ?
                    <span className="clearSearch" onClick={this.props.onClear}>
                        <Icon icon="clear-mini" className="searchIcon"/>
                    </span> :
                    <Icon icon={this.props.icon} className="searchIcon"/>
                }
            </div>
        );
    }
});

export default IconInputBox;
