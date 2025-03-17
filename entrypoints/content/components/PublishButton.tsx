import { FaSolidUpload } from 'solid-icons/fa'

export const PublishButton = (props: any) => {
    return <button disabled={!props.commentHasModules} onClick={() => props.onClick?.()} class='flex items-center justify-center w-10 h-10 rounded-full bg-primary text-amber-400'>
        <FaSolidUpload size={18} />
    </button>
}