/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import QBIcon from '../qbIcon/qbIcon';
import './card.scss';

/**
 *
 * @param title The text to display in the main header of the card, goes next to the icon
 * @param subTitle The subtext of the card, to give a brief description
 * @param icon the qbIcon you want to display
 * @param link the url you want the user to be redirected to when they click on the title of the card
 * @type {ClassicComponentClass<P>}
 */
const Card = React.createClass({

    propTypes: {
        title: PropTypes.string.isRequired,
        subTitle: PropTypes.string,
        icon: PropTypes.string.isRequired,
        link: PropTypes.string
    },

    renderLink() {
        return (
            this.props.link ? <Link to={this.props.link} className="cardLink">{this.props.title}</Link> : this.props.title
        );
    },

    render() {
        return (
            <div className="card">
                <div className="cardHeader">
                    <QBIcon icon={this.props.icon} className="cardIcon"/>
                    <h3 className="headerH3">{this.renderLink()}</h3>
                </div>
                <div className="cardContent">{this.props.subTitle}</div>
            </div>
        );
    }

});

export default Card;
