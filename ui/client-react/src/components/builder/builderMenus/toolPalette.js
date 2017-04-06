import React, {PropTypes, Component} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';
import TabMenu from '../../../../../reuse/client/src/components/sideNavs/tabbedSideMenu';
import NewFieldsMenu from '../../formBuilder/menus/newFieldsMenu';
import ExistingFieldsMenu from '../../formBuilder/menus/existingFieldsMenu';

import './toolPalette.scss';

/**
 * Displays a list of new field types that can be added to the form.
 * TODO: Extend to allow existing fields to be shown as well.
 */
class ToolPalette extends Component {

    renderNewFieldsMenu = () => (<NewFieldsMenu isCollapsed={this.props.isCollapsed} isOpen={this.props.isOpen}/>);

    renderExistingFieldsMenu = () => (<ExistingFieldsMenu isCollapsed={this.props.isCollapsed} isOpen={this.props.isOpen} />);

    renderToolPalette = () => (
        <div className="toolPaletteContainer">
            <TabMenu
                tabs={[
                    {
                        key: 'newFields',
                        title: Locale.getMessage('builder.formBuilder.newFieldsMenuTitle'),
                        content: this.renderNewFieldsMenu()
                    },
                    {
                        key: 'existingFields',
                        title: Locale.getMessage('builder.formBuilder.existingFieldsMenuTitle'),
                        content: this.renderExistingFieldsMenu()
                    }
                ]}
            />
        </div>
    );

    render() {
        return (
            <SideTrowser
                sideMenuContent={this.renderToolPalette()}
                isCollapsed={this.props.isCollapsed}
                isOpen={this.props.isOpen}
            >
                {this.props.children}
            </SideTrowser>
        );
    }
}

ToolPalette.propTypes = {
    /**
     * Display the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Display the menu is an open state (only affects small breakpoint) */
    isOpen: PropTypes.bool,
};

export default ToolPalette;
