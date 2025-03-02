import { createStore } from 'solid-js/store'
import { DiscussionDTO } from '$/services'

type MommentsStore = {
    user: {
        token: string
    }
    discussions: {
        list: DiscussionDTO[]
        active?: DiscussionDTO
    }
    appActive: boolean
    placeNewDiscussionMode: boolean
}

export const [mommentsStore, setMommentsStore] = createStore<MommentsStore>({
    user: {
        token: '',
    },            // The user that is currently logged in
    discussions: {
        list: [],       // All the discussions that are available in the workspace
        active: undefined,     // The currently active discussion in the workspace
    },
    appActive: false,    // Whether the Discussion Mode is active in the workspace
    placeNewDiscussionMode: false
  })


// Nested store for better managing discussions
export const [discussions, setDiscussions] = createStore(mommentsStore.discussions)
