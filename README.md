# My React App

This is a React TypeScript application that integrates with Statsig to dynamically fetch configurations for names and items. The application consists of two main pages: a main page that displays buttons for each name and an item page that displays buttons for each item associated with the selected name.

## Features

- Dynamic fetching of names and items from Statsig configurations.
- Navigation between the main page and item page using React Router.
- Event tracking with Statsig when item buttons are clicked.

## Project Structure

```
my-react-app
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── ItemPage.tsx
│   │   └── MainPage.tsx
│   ├── config
│   │   └── statsigConfig.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── styles
│       └── App.css
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-react-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Configuration

### Statsig

Make sure to set up your Statsig project and configure the dynamic configurations for names and items. Update the `src/config/statsigConfig.ts` file with your Statsig API keys and configuration settings.

## Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. You can run the following commands to lint and format your code:

- Lint:
  ```
  npm run lint
  ```

- Format:
  ```
  npm run format
  ```

## License

This project is licensed under the MIT License.