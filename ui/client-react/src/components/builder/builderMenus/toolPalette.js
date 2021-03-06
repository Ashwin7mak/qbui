import React, {PropTypes, Component} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';
import TabMenu from '../../../../../reuse/client/src/components/sideNavs/tabbedSideMenu';
import NewFieldsMenu from '../../formBuilder/menus/newFieldsMenu';
import ExistingFieldsMenu from '../../formBuilder/menus/existingFieldsMenu';
import * as tabIndexConstants from '../../formBuilder/tabindexConstants';
import RelationshipUtils from '../../../utils/relationshipUtils';
import _ from 'lodash';
import './toolPalette.scss';

/**
 * Displays a list of new field types that can be added to the form.
 * TODO: Extend to allow existing fields to be shown as well.
 */
class ToolPalette extends Component {

    renderNewFieldsMenu = () => {

        const tables = _.get(this.props, "app.tables", []);
        const tableId = _.get(this.props, "formMeta.tableId", null);
        const relationships = _.get(this.props, "formMeta.relationships", []);
        const newRelationshipFieldIds = _.get(this.props, "newRelationshipFieldIds", []);

        const fieldsToDelete = _.get(this.props, "formMeta.fieldsToDelete", []);

        const table = _.find(tables, {id: tableId});

        const validParentTables = RelationshipUtils.getValidParentTablesForRelationship(this.props.app, table, this.props.fields, newRelationshipFieldIds, fieldsToDelete);

        return (
            <NewFieldsMenu isCollapsed={this.props.isCollapsed}
                           isOpen={this.props.isOpen}
                           toolPaletteTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                           toggleToolPaletteChildrenTabIndex={this.props.toggleToolPaletteChildrenTabIndex}
                           toolPaletteChildrenTabIndex={this.props.toolPaletteChildrenTabIndex}
                           toolPaletteFocus={this.props.toolPaletteFocus}
                           includeNewRelationship={validParentTables.length > 0}/>);
    };

    renderExistingFieldsMenu = () => {
        // Only can render the existing fields if an app is provided and form is loaded.
        if (!this.props.appId || !this.props.tableId) {
            return null;
        }

        return (
            <ExistingFieldsMenu isCollapsed={this.props.isCollapsed}
                                isOpen={this.props.isOpen}
                                toolPaletteTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                                toggleToolPaletteChildrenTabIndex={this.props.toggleToolPaletteChildrenTabIndex}
                                toolPaletteChildrenTabIndex={this.props.toolPaletteChildrenTabIndex}
                                toolPaletteFocus={this.props.toolPaletteFocus}
                                app={this.props.app}
                                appId={this.props.appId}
                                tblId={this.props.tableId} />
        );
    };

    renderToolPalette = () => (
        <div className="toolPaletteContainer">
            <TabMenu
                isCollapsed={this.props.isCollapsed}
                tabs={[
                    {
                        key: 'newFields',
                        title: <Tooltip i18nMessageKey="builder.tabs.newFields"> {Locale.getMessage('builder.formBuilder.newFieldsMenuTitle')} </Tooltip>,
                        content: this.renderNewFieldsMenu()
                    },
                    {
                        key: 'existingFields',
                        title: <Tooltip i18nMessageKey="builder.tabs.existingFields"> {Locale.getMessage('builder.formBuilder.existingFieldsMenuTitle')} </Tooltip>,
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

    /**
     * AppId and tableId are used to get the correct existing fields from the table for the loaded form. */
    appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * newly added relationship field IDs
     */
    newRelationshipFieldIds: PropTypes.array,

    /**
     * fields
     */
    fields: PropTypes.array
};

export default ToolPalette;
