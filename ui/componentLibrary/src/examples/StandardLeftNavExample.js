// This is a basic example for the React playground
// Please update to include other properties or states for your component

const basicStandardLeftNavExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <StandardLeftNav
                isCollapsed={false}
                isOpen={true}
                isContextHeaderSmall={true}
                showContextHeader={true}
                contextHeaderIcon="settings"
                contextHeaderTitle="Header Title"
                navItems={[
                    {title: 'Back to My Apps', isPrimaryAction: true, secondaryIcon: 'caret-left'},
                    {icon: 'Report', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Account summary', isDisabled: true},
                    {icon: 'favicon', title: 'Manage apps', isDisabled: true},
                    {icon: 'users', title: 'Manage users', isSelected: true},
                    {icon: 'Group', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Manage groups', isDisabled: true},
                    {icon: 'currency', title: 'Manage billing', isDisabled: true},
                    {icon: 'bell', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, title: 'Contact support'}
                ]}
            />
        </dd>
    </div>
);

ReactDOM.render(basicStandardLeftNavExample, mountNode);
