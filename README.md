# Momments-Frontend
This project contains all source code for the frontend of the Momments prototype from [Robin Dürhager's](https://github.com/robinduerhager) master's thesis entitled `Designing multimodal communication options for exchange between musicians during collaborative composing independent of time and location.`

> [!NOTE]
> **Dependencies of this Project**
> * [momments-backend](https://github.com/robinduerhager/momments-backend) project as an API.
> * [NodeJS 22.11.0](https://nodejs.org/download/release/v22.11.0/)
> * [Google Chrome](https://www.google.com/intl/de_de/chrome/) at least in the Version `136.0.7103.114`
> * [Slightly Modified Wavesurfer-Multitrack library](https://github.com/katspaugh/wavesurfer-multitrack)

## Installation
1. Clone this project to a folder of your choice
2. Go into the project folder
3. Ensure that a version of the [modified Wavesurfer-Multitrack library](https://github.com/robinduerhager/wavesurfer-multitrack) exists in `lib/wavesurfer-multitrack`
   1. Otherwise, go into the `lib` directory: `cd lib`.
   2. Clone the modified library using `git clone https://github.com/robinduerhager/wavesurfer-multitrack.git`
   3. go to the branch `momments-patches`: `git checkout momments-patches`
   4. Install the NodeJS modules: `npm install`
   5. Run `npm run build` to obtain embeddable JavaScript modules
4. In the Project root folder, copy `example.env` to `.env`
5. Run `npm install` to install all necessary NodeJS modules
6. Run `npm run dev` and check on [Google](https://www.google.com/) if the project is working

Once step 6 has been completed, a Google Chrome instance containing the browser extension should open. In development mode, the extension is activated on `https://www.soundtrap.com/studio/*` and `https://www.google.de/*`. If the extension was built for production using `npm run build`, the extension is only activated for `https://www.soundtrap.com/studio/*`. The list of these URLs can be customized in `entrypoints/content/index.tsx`.

## Project structure
The folder structure is shown below and explained briefly and concisely in the comments. Folders in the project structure that were not actively used for the project are not discussed. For example, `assets` and `public` were not needed for the development of the project but were not removed from the project for the sake of completeness. Other files, such as the `package*.json` files and this `README.md` file, have been omitted from the list for clarity:

```bash
momments-frontend/
├── entrypoints                 # Any project code for the extension
│   └── content                 # Entry point for content-scripts
│       ├── index.tsx           # Injection of the content-script code of the Momment-project through the extension
│       ├── App.tsx             # Entry point for the business logic of the content-script
│       ├── main.css            # Global Styles
│       ├── store.ts            # SolidJS Store
│       ├── components          # Collection of all UI components
│       ├── services            # Collection of all services for using the backend
│       └── utils               # Utility functions, such as an HTTP client and blocking keyboard shortcuts for the underlying collaborative DAW
├── example.env                 # Template for needed .env file
├── globals.d.ts                # Global type definition for improved integration of libraries without TypeScript support
├── lib                         # Collection of other non-npm modules
│   └── wavesurfer-multitrack   # Modified wavesurfer-multitrack project
├── tsconfig.json               # TypeScript Configuration
└── wxt.config.ts               # WXT Configuration (Framework for improved extension development)
```