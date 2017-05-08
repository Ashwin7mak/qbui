import React, {PropTypes, Component} from 'react';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Icon from 'REUSE/components/icon/icon';

import './topNav.scss';

class TopNav extends Component {
    constructor(props) {
        super(props);
    }

    getTopTitle = () => {
        let {title} = this.props;

        if (title) {
            return (
                <div className="topTitle">
                    {title}
                </div>
            );
        }

        return null;
    };

    render() {
        let {showOnSmall, onNavClick, globalActions, tabIndex} = this.props;
        tabIndex = tabIndex ? tabIndex : "1";
        const classes = `topNav${(showOnSmall ? '' : ' hideSmall')}`;

        return (
            <div className={classes}>
                <div className="top">
                    <div className="navGroup left">
                        <ButtonGroup className="navItem">
                            <Button tabIndex="1"  className="iconLink toggleNavButton" onClick={onNavClick}>
                                <Icon icon="hamburger" />
                            </Button>

                            {this.getTopTitle()}
                        </ButtonGroup>
                    </div>

                    <div className="navGroup center">
                        {this.props.centerGlobalActions}
                    </div>

                    <div className="navGroup right">
                        {globalActions}
                    </div>
                </div>
            </div>
        );
    }
}

TopNav.propTypes = {
    /**
     * Occasionally, the XD spec requires that the topNav is hidden on small breakpoint. Set this to false to hide the TopNav at that breakpoint. */
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
    globalActions: PropTypes.element,
};

TopNav.defaultProps = {
    showOnSmall: true,
};

export default TopNav;
