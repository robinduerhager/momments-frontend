import './main.css'
import { render } from 'solid-js/web'
import App from './App'

export default defineContentScript({
  matches: ['https://www.bandlab.com/', 'https://www.google.de/'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'momments-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Render your app to the UI container
        const unmount = render(() => <App/>, container)
        return unmount
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount?.()
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});