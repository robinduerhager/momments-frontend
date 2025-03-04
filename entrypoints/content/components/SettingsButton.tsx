import { FaSolidGear } from 'solid-icons/fa';
import { Settings } from './Settings';

export const SettingsButton = () => {
    return (
        <>
            <Settings />
            <button popoverTarget='settings-popover' class={`
                bg-blue-400
                w-[50px]
                h-[50px]
                rounded-full
                flex
                justify-center
                items-center`}
                
                style={`anchor-name: --settings-button;`}>
                <FaSolidGear size={32} color="#ffffff" />
            </button>
        </>
    )
}