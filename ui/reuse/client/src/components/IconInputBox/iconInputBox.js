import React from 'react';
import './iconInputBox.scss';
import Icon from '../icon/icon';
/**
 * Generic component that renders a search box
 */
const IconInputBox = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        searchBoxKey: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        hideClearIcon: React.PropTypes.bool, //if the box chooses to not render clear icon
        onChange: React.PropTypes.func,
        onClearSearch: React.PropTypes.func,
        value: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            hideClearIcon: false
        };
    },
    render: function() {
        let className = "searchInputBox ";
        className += (this.props.className ? this.props.className : "");
        return (
            <div className={className}>
                <input className="searchInput" type="text"
                   key={this.props.searchBoxKey}
                   value={this.props.value}
                   onChange={this.props.onChange}
                   placeholder={this.props.placeholder}>
                </input>
                {this.props.value && this.props.value.length && !this.props.hideClearIcon ?
                    <span className="clearSearch" onClick={this.props.onClearSearch}>
                        <Icon icon="clear-mini" className="searchIcon"/>
                    </span> :
                    <Icon icon="search" className="searchIcon"/>
                }
            </div>
        );
    }
});

export default IconInputBox;
