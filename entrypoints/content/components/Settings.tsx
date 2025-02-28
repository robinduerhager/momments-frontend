import { createSignal } from "solid-js"
import { mommentsStore, setMommentsStore } from "@/entrypoints/content/store"
import axios from 'axios'

export const Settings = () => {
    const [secret, setSecret] = createSignal('')

    const handleClick = async (e: Event) => {
        const { data } = await axios.post('http://localhost:8080/login', {
            secret: secret()
        })
        console.log(data)
        setMommentsStore('user', { token: data.token })
    }

    createEffect(() => {
        console.log(mommentsStore.user.token)
    })

    return (
        <>
            <div popover id="settings-popover" class="bg-zinc-950 w-[320px] mb-3" style={`position-area: top; position-anchor: --settings-button;`}>
                <div class="m-3 flex flex-col items-center">
                    <input type="text" name="secret" placeholder="User Secret" value={secret()} onChange={(e) => {
                        setSecret(e.target.value)
                    }} />
                    <button class="button-primary mt-2" onClick={handleClick}>Login</button>
                </div>
            </div>
        </>
    )
}