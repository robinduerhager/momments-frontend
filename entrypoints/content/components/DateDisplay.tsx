import { createSignal, onMount, onCleanup, Match, Switch } from "solid-js";

export const DateDisplay = (props: {
    date: Date
}) => {
    const [now, setNow] = createSignal(new Date(Date.now()))
    let updateNowIntervalHandler: NodeJS.Timeout | undefined = undefined

    /**
     * @description Updates the now signal with the current time.
     */
    const updateNow = () => {
        setNow(new Date(Date.now()))
    }

    /**
     * @description Calculates the difference between the current time and the provided date in weeks, days, hours, and minutes.
     * @returns An object containing the difference in weeks, days, hours, and minutes.
     */
    const diffDates = (): {
        weeks: number,
        days: number,
        hours: number,
        minutes: number,
    } => {
        // now() will always be greater than props.date.getTime()
        // order matters in subtraction!
        return {
            weeks: Math.floor((now().getTime() - props.date.getTime()) / (1000 * 60 * 60 * 24 * 7)),
            days: Math.floor((now().getTime() - props.date.getTime()) / (1000 * 60 * 60 * 24)),
            hours: Math.floor((now().getTime() - props.date.getTime()) / (1000 * 60 * 60)),
            minutes: Math.floor((now().getTime() - props.date.getTime()) / (1000 * 60)),
        }
    }

    /**
     * @description Helper function to determine if the plural form should be used for the time unit.
     * @param time The time in weeks, days, hours, or minutes.
     * @returns A string 's' if the time is greater than 1, otherwise an empty string.
     */
    const needsS = (time: number) => time > 1 ? 's' : ''

    onMount(() => {
        // Update the now variable every minute with the current time
        updateNowIntervalHandler = setInterval(updateNow, 1000 * 60)
    })

    onCleanup(() => {
        clearInterval(updateNowIntervalHandler)
    })

    return (
        <span class="text-zinc-400">
            <Switch>
                <Match when={diffDates().weeks > 2}>
                    {props.date.toLocaleDateString('de-DE')}
                </Match>
                <Match when={diffDates().days > 6}>
                    {diffDates().weeks} week{needsS(diffDates().weeks)} ago
                </Match>
                <Match when={diffDates().hours > 23}>
                    {diffDates().days} day{needsS(diffDates().days)} ago
                </Match>
                <Match when={diffDates().minutes > 59}>
                    {diffDates().hours} hour{needsS(diffDates().hours)} ago
                </Match>
                <Match when={diffDates().minutes <= 59 && diffDates().minutes > 4}>
                    {diffDates().minutes} minute{needsS(diffDates().minutes)} ago
                </Match>
                <Match when={diffDates().minutes <= 4}>
                    right now
                </Match>
            </Switch>
        </span>
    )
}