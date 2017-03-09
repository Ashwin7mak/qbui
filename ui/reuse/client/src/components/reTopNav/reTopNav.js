import React, {PropTypes, Component} from 'react';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
import QBicon from '../../../../../client-react/src/components/qbIcon/qbIcon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './reTopNav.scss';

class ReTopNav extends Component {
    constructor(props) {
        super(props);

        this.getTopTitle = this.getTopTitle.bind(this);
    }

    getTopTitle() {
        let {title} = this.props;

        if (title) {
            return (
                <div className="topTitle">
                    {title}
                </div>
            );
        }

        return null;
    }


    render() {
        let {showOnSmall, onNavClick, globalActions} = this.props;

        const classes = "topNav" + (showOnSmall ? "" : " hideSmall");

        const unimplementedSearchTip = <Tooltip id="unimplemented.search.tt"><I18nMessage message="unimplemented.search"/></Tooltip>;
        const unimplementedFavoritesTip = <Tooltip id="unimplemented.favorites.tt"><I18nMessage message="unimplemented.favorites"/></Tooltip>;

        return (
            <div className={classes}>
                <div className="top">
                    <div className="navGroup left">
                        <ButtonGroup className="navItem">
                            <Button tabIndex="1"  className="iconLink toggleNavButton" onClick={onNavClick}>
                                <QBicon icon="hamburger" />
                            </Button>

                            {this.getTopTitle()}
                        </ButtonGroup>
                    </div>

                    <div className="navGroup center">

                        <ButtonGroup className="navItem">

                            <OverlayTrigger placement="bottom" trigger={['hover', 'click']} overlay={unimplementedSearchTip}>
                                <Button tabIndex="2" className="disabled">
                                    <QBicon icon="search" />
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="bottom" trigger={['hover', 'click']} overlay={unimplementedFavoritesTip}>
                                <Button tabIndex="3" className="disabled"><QBicon icon="star-full" /></Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </div>

                    <div className="navGroup right">
                        {globalActions}
                    </div>
                </div>
            </div>
        );
    }
}

ReTopNav.propTypes = {
    showOnSmall: PropTypes.bool,
    title: PropTypes.node,
    onNavClick: PropTypes.func,
    globalActions: PropTypes.element
};

ReTopNav.defaultProps = {
    showOnSmall: false,
};

export default ReTopNav;
