import { Show } from 'solid-js';
import { FaSolidComment, FaSolidXmark } from "solid-icons/fa";
import { mommentsStore, setMommentsStore, discussions } from '$/store';

export const ActivationButton = () => {
    const hasUnreadDiscussions = () => discussions.list.some(discussion => !discussion.readBy)

    const handleClick = async () => {
        setMommentsStore('appActive', !mommentsStore.appActive)
    }

    return (
        <button class={`relative ${mommentsStore.appActive ? 'bg-red-400' : 'bg-blue-400'} ${mommentsStore.appActive ? 'w-[50px] h-[50px]' : 'w-[64px] h-[64px]'} rounded-full flex justify-center items-center`} onClick={handleClick}>
            <Show when={!mommentsStore.appActive} fallback={<FaSolidXmark size={32} color="#ffffff" />}>
                <FaSolidComment size={32} color="#ffffff" />
                <Show when={hasUnreadDiscussions()}>
                    <div class='w-[20px] h-[20px] rounded-full absolute bottom-0 right-0 bg-green-500'>
                        <div class='discussion-activation-awareness-animation'></div>
                    </div>
                </Show>
            </Show>
        </button>
    )
}