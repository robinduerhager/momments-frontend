import { createSignal, Match, Switch } from "solid-js"
import { mommentsStore, setMommentsStore, user, setUser } from "$/store"
import { UserService } from "$/services"
import keyblocker from "$/utils/keyblocker"
import { Avatar } from "./Avatar"

export const Settings = () => {
    const [secret, setSecret] = createSignal('')
    const [isOpen, setIsOpen] = createSignal(false)
    const [availableAudioInputDevices, setAvailableAudioInputDevices] = createSignal<MediaDeviceInfo[]>([])
    let popoverRef: HTMLDivElement | undefined

    const handleLogin = async () => {
        const secretResponse = await UserService.login(secret())

        if (!secretResponse)
            return console.error('Login failed')

        setUser('token', secretResponse.data.token)
    }

    const handleLogout = () => {
        setUser('token', '')
        setMommentsStore('appActive', false)
    }

    const handlePopoverToggle = (e: Event) => {
        if ((e as ToggleEvent).newState === 'open') {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }

    createEffect(async () => {
        if (mommentsStore.user.token) {
            // When the user token has been set, fetch user and display in the Settings, so the user can see with which account he is logged in
            const userdto = (await UserService.me()).data
            setUser(produce(user => {
                user.avatar = userdto.avatar
                user.name = userdto.name
            }))

            // Fetch available audio input devices
            const audioDevices = await navigator.mediaDevices.enumerateDevices()
            setAvailableAudioInputDevices(audioDevices.filter(device => device.kind === 'audioinput'))
        }
    })

    onMount(() => {
        popoverRef?.addEventListener('toggle', handlePopoverToggle)
    })
    
    onCleanup(() => {
        popoverRef?.removeEventListener('toggle', handlePopoverToggle)
    })

    createEffect(() => {
        if (isOpen()) {
            keyblocker.setup()
        } else {
            if (!mommentsStore.appActive) {
                console.log('cleanup settings');
                keyblocker.remove()
            }
        }
    })

    return (
        <>
            <div popover ref={popoverRef} id="settings-popover" class="bg-zinc-950 w-[320px] mb-3 rounded-md border border-solid border-zinc-200" style={`position-area: top; position-anchor: --settings-button;`}>
                <div class="p-3 flex flex-col items-center">
                    <Switch>
                        <Match when={user.token}>
                            <h1 class="font-bold text-white">Logged in as</h1>
                            {/* Show Logout Button and loggend in user if logged in */}
                            <Show when={user.avatar && user.name}>
                                <div class='flex gap-2.5 my-5 items-center'>
                                    <Avatar image={`${user.avatar}`} />
                                    <span class='font-semibold text-zinc-200'>{user.name}</span>
                                </div>
                            </Show>
                            <div class="flex flex-col gap-2.5 mb-5 items-center">
                                <h2 class="font-semibold text-white">Select Audio Input Device</h2>
                                <select
                                    class="text-white"
                                    value={mommentsStore.audioInputDevice?.deviceId}
                                    onInput={(e) => {
                                        const deviceId = e.currentTarget.value
                                        const selectedDevice = availableAudioInputDevices().find(device => device.deviceId === deviceId) || undefined
                                        setMommentsStore('audioInputDevice', selectedDevice)
                                    }}
                                >
                                    <For each={availableAudioInputDevices()}>
                                        {(device) => <option value={device.deviceId}>{device.label}</option>}
                                    </For>
                                </select>
                            </div>
                            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-red-700 text-zinc-200 shadow h-9 px-4 py-2" onClick={handleLogout}>Logout</button>
                        </Match>
                        {/* Show Login Button if logged out */}
                        <Match when={!user.token}>
                            <input type="text" name="secret" placeholder="User Secret" value={secret()} onChange={(e) => {
                                setSecret(e.target.value)
                            }} />
                            <button class="button-primary mt-2" onClick={handleLogin}>Login</button>
                        </Match>
                    </Switch>
                </div>
            </div>
        </>
    )
}