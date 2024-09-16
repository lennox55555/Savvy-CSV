# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Running the project locally in your browser (for development):
* Cd into /frontend
* Run ```npm run dev```
* Project will be located at ```http://localhost:5173/```

## Running the project locally on mobile device (for development):
* Locate your computer's IP Address: 
* For MacOS run ```ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'```
* For WindowsOS run ```ipconfig | findstr /R /C:"IPv4 Address" | findstr /V "127.0.0.1"```
* Ensure both devices on are the same network 
* Run ```npm run dev```
* Navigate to ```http://<Local-IP>:5173/``` on mobile device

## Installing dependencies in React App (For development):
* Cd into /frontend
* Run ```npm install {dependency}```

## Check linting for Client (for development):
* Cd /frontend
* Run ```npm run lint```
