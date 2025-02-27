import { Show } from 'solid-js';
import { mommentsStore, setMommentsStore } from '@/entrypoints/content/store';
import { FaSolidComment, FaSolidXmark } from "solid-icons/fa";

export const ActivationButton = () => {
    return (
        <button class={`cursor-pointer ${mommentsStore.appActive ? 'bg-red-400' : 'bg-blue-400'} ${mommentsStore.appActive ? 'w-[50px] h-[50px]' : 'w-[64px] h-[64px]'} rounded-full flex justify-center items-center`} onClick={() => setMommentsStore('appActive', !mommentsStore.appActive)}>
            <Show when={mommentsStore.appActive} fallback={<FaSolidComment size={32} color="#ffffff" />}>
                <FaSolidXmark size={32} color="#ffffff" />
            </Show>
        </button>
    )
}