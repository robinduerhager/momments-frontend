import { FaSolidPlus } from 'solid-icons/fa'

export const AddCommentButton = () => {
    return (
        <button class={`cursor-pointer bg-green-400 w-[64px] h-[64px] rounded-full flex justify-center items-center`}>
            <FaSolidPlus size={32} color="#ffffff" />
        </button>
    )
}