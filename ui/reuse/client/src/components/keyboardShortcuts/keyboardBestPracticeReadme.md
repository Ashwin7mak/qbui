##Keyboard best Practice

Throughout this file I will be using grandparents, parents and children to refer to three different level of tabbing order.

It is best practice to use the tabindex "-1" to remove parents and children from the tabbing flow, and then to programmatically
change the tabindex to "0", to add it back to the tabbing flow on the page. Never force your own tabindex by numerically adding a tabindex "1"
to one child, "2" to the next and etc... This has negative side effects on the tabbing flow on the page.

If you need to invoke a function by pressing enter/sapce on a dom element, it is best practice that this dom element be a 'button.' However, in some cases
it is not feasible to have the dom element to always be a button. In the instances that you need to make a 'div' clickable, you must assign a role of
button to the 'div' (e.g. role="button"). This is required for accessibility purposes, screen readers will use the role of button to let the user know
that they are on a div that is clickable, because the screen reader will describe it as a 'button'.

##Below is the current implementation of key navigation on form builder. Try and follow this pattern as best as you can, so we can keep all keyboard
##navigation behavior consistent throughout the QuickBase app.

- Each keyboard behavior was implemented by using either the keyboardShortcuts component or by adding event listeners to the div.

Enter/Space's current implementation on form builder:
- Enter/Space is used to select a parent, which switches the children's tabindex from "-1" to "0". By switching the tabindex to "0" it adds the child
to the tabbing order on the page and by switching it to "-1" it removes it from the tabbing order. Enter/Space are also used to click on buttons on the page.

Escape's current implementation on form builder:
- The escape key is used to escape a current tabbing flow. For example if a user is tabbing through the children on the page, escape will remove
the children from the tabbing flow, and the user will only be able to tab through the parents on the page. If escape is hit again, then the parents
are removed from the tabbing flow and only the grandparents are allowed to be tab through on the page. If escape is hit again, it will now exit form builder.

Tab's current implementation on form builder:
- Currently tab is only used to change focus throughout the page.

Backspace's current implementation on form builder:
- Currently backspace removes a field off of a form.

Shift + Up/down current implementation on form builder:
- Currently the up/down arrow key allows a user to reorder a field on the form.

cmd/ctrl + s current implementation on form builder:
- Saves a form
