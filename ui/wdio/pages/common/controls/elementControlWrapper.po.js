module.exports = class ElementControlWrapper {
    constructor(selector, element) {
        this.selector = selector;
        this.element = element;
    }

    get control() {
        if (this.selector) {
            browser.waitForVisible(this.selector);
            return browser.element(this.selector);
        }

        return this.element;
    }

    get isVisible() {
        return browser.element(this.selector).isVisible();
    }

    get text() {
        if (this.control.getTagName() === 'input' || this.control.getTagName() === 'textarea') {
            return this.control.getValue();
        }
        return this.control.getAttribute('textContent');
    }

    set text(text) {
        this.control.setValue(text);
    }

    /**
     * i have to add this function specifically for one particular element in Edge browser because setValue was setting only
     * several chars out of whole test string in textarea
     * @param text
     */
    setTextInTextArea(text, textAreaElementIndex) {
        if (!textAreaElementIndex) {
            textAreaElementIndex = 0;
        }
        browser.execute(function(valueToSet, elementIndex) {
            let element = document.getElementsByTagName('textarea')[elementIndex];
            element.innerText = valueToSet;
        }, text, textAreaElementIndex);
    }

    click() {
        this.control.click();
    }
};
