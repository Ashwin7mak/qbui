import React, {PropTypes, Component} from 'react';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import ReIcon from '../reIcon/reIcon';
import Tooltip from '../tooltip/tooltip';

import './topNav.scss';

class ReTopNav extends Component {
    constructor(props) {
        super(props);

        this.getTopTitle = this.getTopTitle.bind(this);
        this.renderCenterGlobalActions = this.renderCenterGlobalActions.bind(this);
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

    renderCenterGlobalActions() {
        if (this.props.centerGlobalActions) {
            return this.props.centerGlobalActions;
        }

        return (
            <ButtonGroup className="navItem">
                <Tooltip i18nMessageKey="unimplemented.search" location="bottom">
                    <Button tabIndex="2" className="disabled">
                        <ReIcon icon="search" />
                    </Button>
                </Tooltip>

                <Tooltip i18nMessageKey="unimplemented.favorites" location="bottom">
                    <Button tabIndex="3" className="disabled"><ReIcon icon="star-full" /></Button>
                </Tooltip>
            </ButtonGroup>
        );
    }

    render() {
        let {showOnSmall, onNavClick, globalActions} = this.props;

        const classes = `topNav${(showOnSmall ? '' : ' hideSmall')}`;

        return (
            <div className={classes}>
                <div className="top">
                    <div className="navGroup left">
                        <ButtonGroup className="navItem">
                            <Button tabIndex="1"  className="iconLink toggleNavButton" onClick={onNavClick}>
                                <ReIcon icon="hamburger" />
                            </Button>

                            {this.getTopTitle()}
                        </ButtonGroup>
                    </div>

                    <div className="navGroup center">
                        {this.renderCenterGlobalActions()}
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

    /**
     * A title that only appears when the navbar is shown on a small screen */
    title: PropTypes.node,

    /**
     * Callback that is fired when the hamburger menu on the left of the navbar is clicked */
    onNavClick: PropTypes.func,

    /**
     * Actions that appear at the center of the nav bar */
    centerGlobalActions: PropTypes.element,

    /**
     * Actions that appear on the right side of the nav bar */
    globalActions: PropTypes.element
};

ReTopNav.defaultProps = {
    showOnSmall: false,
};

export default ReTopNav;
