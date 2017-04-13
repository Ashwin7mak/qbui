// This is a basic example for the React playground
// Please update to include other properties or states for your component

let mock = {
    onOpen: () => {},
    onClose: () => {},
    onSelect: () => {},
    icons: ["Apple", "carfront", "cat", "Chicken", "heart", "ruler", "bell", "duck"]
};

const basicIconChooserExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <IconChooser selectedIcon="Apple"
                         isOpen={true}
                         onOpen={mock.onOpen}
                         onClose={mock.onClose}
                         font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                         icons={mock.icons}
                         onSelect={mock.onSelect} />
        </dd>
    </div>
);

ReactDOM.render(basicIconChooserExample, mountNode);
