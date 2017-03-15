## ReKeyboardShortcuts

### Description

The ReKeyboardShortcuts component allows you to quickly add keyboard shortcuts to your app. 

The motivating behind setting up keyboard shortcuts was twofold:

1) To create a similar infrastructure for keyboard shortcuts across the qbase ecosystem
2) To make it easy to add keyboard shortcuts
3) To easily debug conflicting keyboard shortcuts

Goals 1 and 2 are met by adding this component within the reuse library and making it easy
for any functional area to use it.

Goal 3 is met by publishing all the currently active keybindings in a Redux store.
Developers can use the "Redux" devtools to quickly see which bindings are listening to each 
key and quickly debug any conflicting keybindings. In addition, components will automatically clean
up their own bindings when they are unmounted.

### Setup

To use this component within a functional area you must include the the `reKeyboardReducer` as  `keyboard` within your Redux store setup.

E.g.,
``` javascript
import keyboard from '../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardReducer';

export default combineReducers({
   someOtherStore,
   store3,
   keyboard // <- This one must be present for ReKeyboardShortcuts to work
});
```

### Setting Keyboard Shortcuts

Using `ReKeyboardShortcuts` is as easy as importing the component and
passing it a list of keyboard shortcuts and callbacks. The component will take care of the rest.

#### Required Props
**id:** A unique id that identifies this keybinding set. Helps clarify which keybindings are being set by each instance of this component.
**shortcutBindings:** An array of bindings. Each binding in the array must be an object that has:
  - **key:** The keys that should activate the callback. See available options at https://craig.is/killing/mice#api.bind  
  - **callback:** The function that will be called when the keys are pressed. It receives one argument, `content`.
  - **content:** Any additional information that will be passed as the first argument to the callback. This is optional.

```javascript
import ReKeyboardShortcuts from '../../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardShortcuts';

// Imports above, example render method below
class MyComponent extends Component {
    render() {
        return (
            <div className="myComponent">
                <ReKeyboardShortcuts id="formBuilder" shortcutBindings={[{key: 's', callback: (content) => alert(`You pressed s! Extra info: ${content}`), content: 'Some extra information'}]}/>
                {MyOwnContent}
            </div>
        );
    }   
}
```

