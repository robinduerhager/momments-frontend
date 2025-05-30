import { createStore } from 'solid-js/store'
import { DiscussionDTO } from '$/services'

type MommentsStore = {
    user: {
        token: string,
        name?: string,
        avatar?: string
    }
    discussions: {
        list: Omit<DiscussionDTO, 'comments'>[]
        active?: DiscussionDTO
    }
    audioInputDevice: MediaDeviceInfo | undefined
    appActive: boolean,
    settingsOpened: boolean,
    placeNewDiscussionMode: boolean
}

export const [mommentsStore, setMommentsStore] = createStore<MommentsStore>({
    user: {
        token: '',
        name: undefined,
        avatar: undefined
    },                          // The user that is currently logged in
    discussions: {
        list: [],               // All the discussions that are available in the workspace
        active: undefined,      // The currently active discussion in the workspace
    },
    audioInputDevice: undefined,
    appActive: false,           // Whether the Discussion Mode is active in the workspace
    settingsOpened: false,      // Whether the settings popover is opened
    placeNewDiscussionMode: false
  })

// Nested store for better managing discussions
export const [discussions, setDiscussions] = createStore(mommentsStore.discussions)
export const [user, setUser] = createStore(mommentsStore.user)
