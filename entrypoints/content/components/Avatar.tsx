export const Avatar = (props: { image: string }) => {
    return <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img src={`${import.meta.env.WXT_API_ENDPOINT}/${props.image}`} class='aspect-square h-full w-full' />
            </span>
}