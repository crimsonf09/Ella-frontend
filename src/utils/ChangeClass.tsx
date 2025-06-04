export interface ChangeClassProps {
    name: string; 
    selector: string; 
    changedClassName: string; 
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