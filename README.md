# MintList - DCIT 26 Laboratory 4

## Features included
- React components and React state/event handling
- Tailwind CSS responsive styling
- Zustand global state for tasks and task groups
- Zustand persist middleware to save task data in browser local storage
- Axios + DummyJSON API integration with loading and error handling
- Add, complete/uncomplete, and delete tasks
- Create, view, and delete task groups
- Group task progress displayed as `completed out of total` (example: `5 out of 10 completed`)
- React Router routes: `/home`, `/tasks`, `/groups`, `/groups/:groupId`, `/guide`, `/users`, `/developers`

## Run locally
1. Extract the ZIP file.
2. Open the `ToDoLIst-main` folder in VS Code.
3. Open the terminal in that folder.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL shown in the terminal.

## Build
Run `npm run build`.

## Deploy
Netlify build command: `npm run build`; publish directory: `dist`.
Vercel uses the included `vercel.json` rewrite for direct route refreshes.

## Before submission
Review the Developers page and make sure all member names are correct. Test all routes and task actions. Task data is stored in browser local storage and is not synced between different devices.
