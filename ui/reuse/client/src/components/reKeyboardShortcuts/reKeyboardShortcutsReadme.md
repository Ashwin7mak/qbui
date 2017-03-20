## ReKeyboardShortcuts

### Description

The ReKeyboardShortcuts component allows you to quickly add keyboard shortcuts to your app. 

The motivation behind setting up keyboard shortcuts was twofold:

1) To create a similar infrastructure for keyboard shortcuts across the qbase ecosystem
2) To make it easy to add keyboard shortcuts

Goals 1 and 2 are met by adding this component within the reuse library and making it easy
for any functional area to use it.

### Setup
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

