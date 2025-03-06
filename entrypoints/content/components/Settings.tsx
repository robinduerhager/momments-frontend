import { createSignal, Match, Switch } from "solid-js"
import { mommentsStore, setMommentsStore, user, setUser } from "$/store"
import { UserService } from "$/services"
import { Avatar } from "./Avatar"

export const Settings = () => {
    const [secret, setSecret] = createSignal('')

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

    createEffect(async () => {
        if (mommentsStore.user.token) {
            // When the user token has been set, fetch user and display in the Settings, so the user can see with which account he is logged in
            const userdto = (await UserService.me()).data
            setUser(produce(user => {
                user.avatar = userdto.avatar
                user.name = userdto.name
            }))
            console.log(userdto);
        }
    })

    return (
        <>
            <div popover id="settings-popover" class="bg-zinc-950 w-[320px] mb-3 rounded-md border border-solid border-zinc-200" style={`position-area: top; position-anchor: --settings-button;`}>
                <div class="p-3 flex flex-col items-center">
                    <Switch>
                        <Match when={user.token}>
                            <h1 class="font-bold">Logged in as</h1>
                            {/* Show Logout Button and loggend in user if logged in */}
                            <Show when={user.avatar && user.name}>
                                <div class='flex gap-2.5 my-5 items-center'>
                                    <Avatar image={`${user.avatar}`} />
                                    <span class='font-semibold text-zinc-200'>{user.name}</span>
                                </div>
                            </Show>
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