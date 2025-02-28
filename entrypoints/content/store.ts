import { createStore } from 'solid-js/store'

export const [mommentsStore, setMommentsStore] = createStore({
    user: {
        token: '',
    },            // The user that is currently logged in
    discussions: {
        discussionList: [],       // All the discussions that are available in the workspace
        activeDiscussion: {},     // The currently active discussion in the workspace
    },
    appActive: false,    // Whether the Discussion Mode is active in the workspace
  })
