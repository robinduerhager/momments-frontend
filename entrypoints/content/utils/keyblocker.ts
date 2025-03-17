const blockKeydown = (event: KeyboardEvent) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
}

const setup = () => {
    document.addEventListener('keydown', blockKeydown, true)
    window.addEventListener('keydown', blockKeydown, true)
}

const remove = () => {
    document.removeEventListener('keydown', blockKeydown, true)
    window.removeEventListener('keydown', blockKeydown, true)
}

export default {
    setup,
    remove
}