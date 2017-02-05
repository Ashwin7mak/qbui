/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import QBIcon from '../../qbIcon/qbIcon';
import './settingsMenuItem.scss';

const SettingsMenuItem = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subTitle: PropTypes.string,
        icon: PropTypes.string.isRequired,
        link: PropTypes.string
    },

    renderLink() {
        return (
            this.props.link ? <Link to={this.props.link}>{this.props.title}</Link> : this.props.title
        );
    },

    render() {
        return (
            <div className="card">
                <div id="header" className="cardHeader">
                    <QBIcon icon={this.props.icon} className="cardIcon"/>
                    <h3 className="headerH3">{this.renderLink()}</h3>
                </div>
                <div id="content" className="cardContent"><p className="contentP">{this.props.subTitle}</p></div>
            </div>
        );
    }

});

export default SettingsMenuItem;