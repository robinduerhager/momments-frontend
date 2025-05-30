export const Avatar = (props: { image: string }) => {
    return <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                {/* Avatar Images are inside the public folder of the Backend and therefore directly fetchable */}
                <img src={`${import.meta.env.WXT_API_ENDPOINT}/${props.image}`} class='aspect-square h-full w-full' />
            </span>
}