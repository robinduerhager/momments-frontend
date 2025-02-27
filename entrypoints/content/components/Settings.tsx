export const Settings = () => {
    return (
        <>
            <div popover id="settings-popover" class="bg-zinc-950 w-[320px] h-[250px] mb-3" style={`position-area: top; position-anchor: --settings-button;`}>
                <div class="m-3">
                    <label>User Token: </label>
                    <input type="text" name="usertoken" class="bg-zinc-950 border-2 border-zinc-200"/>
                </div>
            </div>
        </>
    )
}