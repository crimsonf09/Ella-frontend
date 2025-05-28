export interface ChangeClassProps {
    name: string; // Descriptive name of the element (for logging/debugging purposes)
    selector: string; // Full CSS selector copied directly from Chrome DevTools
    changedClassName: string; // New class name(s) to apply to the element
}

/**
 * Escapes special characters in class names within a CSS selector.
 * @param selector - The CSS selector string copied directly from Chrome DevTools.
 * @returns Escaped selector string.
 */
const ChangeClass = (props: ChangeClassProps) => {
    const targetElement = document.querySelector(props.selector);

    if (targetElement) {
        targetElement.className = props.changedClassName;
        console.log(`Changed class of ${props.name} to "${props.changedClassName}"`);
    } else {
        console.warn(`Target element "${props.name}" not found.`);
    }
};

export default ChangeClass;