import { FaSolidPlus } from 'solid-icons/fa'
import { setMommentsStore } from '../store'

export const AddDiscussionButton = () => {
    const activateDiscussionPlacementMode = () => {
        setMommentsStore('placeNewDiscussionMode', true)
    }

    return (
        <button class={`bg-green-400 w-[64px] h-[64px] rounded-full flex justify-center items-center`} onClick={activateDiscussionPlacementMode}>
            <FaSolidPlus size={32} color="#ffffff" />
        </button>
    )
}