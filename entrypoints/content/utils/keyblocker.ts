/**
 * 
 * @description This utility blocks all keydown events in the content script to prevent unwanted interactions.
 * @param event The keydown event to block
 */
const blockKeydown = (event: KeyboardEvent) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
}

/**
 * @description Sets up the keydown event listeners to block all keydown events, e.g. shortcuts of the underlying software.
 */
const setup = () => {
    document.addEventListener('keydown', blockKeydown, true)
    window.addEventListener('keydown', blockKeydown, true)
}

/**
 * @description Removes the keydown event listeners that block all keydown events, e.g. in case the application gets closed so all shortcuts of the underlying software should be used again.
 */
const remove = () => {
    document.removeEventListener('keydown', blockKeydown, true)
    window.removeEventListener('keydown', blockKeydown, true)
}

export default {
    setup,
    remove
}