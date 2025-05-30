import { FaSolidPlus } from 'solid-icons/fa'
import { setMommentsStore } from '../store'

export const AddDiscussionButton = () => {
    /**
     * @description Activates the discussion placement mode. This mode shows a DiscussionProxy at the cursor of the user and allows the user to place a new discussion by clicking on the desired position in the workspace.
     */    
    const activateDiscussionPlacementMode = () => {
        setMommentsStore('placeNewDiscussionMode', true)
    }

    return (
        <button class={`bg-green-400 w-[64px] h-[64px] rounded-full flex justify-center items-center`} onClick={activateDiscussionPlacementMode}>
            <FaSolidPlus size={32} color="#ffffff" />
        </button>
    )
}