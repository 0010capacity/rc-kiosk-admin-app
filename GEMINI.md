# Project Overview

This is the **RC Kiosk Admin App**, a web application designed to help administrators manage a souvenir kiosk. It is built using **React** and **TypeScript** for the frontend, with **Vite** as the build tool and **Tailwind CSS** for styling. The application integrates with **Firebase** for certain backend functionalities (e.g., authentication) and **Supabase** for database interactions.

## Technologies Used

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (with a custom Red Cross color palette)
*   **Backend/Auth:** Firebase
*   **Database:** Supabase
*   **Routing:** React Router DOM
*   **UI Components:** Headless UI, Recharts, React Beautiful DnD, React Datepicker

## Building and Running

To set up and run the project locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The development server will typically run on `http://localhost:5173`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    This command will generate static files in the `dist/` folder.

4.  **Deploy to Firebase Hosting:**
    ```bash
    npm run deploy
    ```
    This command deploys the application to Firebase Hosting.

## Development Conventions

*   **Language:** TypeScript is used for type safety and improved developer experience.
*   **Styling:** Tailwind CSS is the primary styling framework. A custom color palette, based on Red Cross branding, is defined in `tailwind.config.ts` and should be used consistently throughout the application. Avoid mixing with default Tailwind colors.
*   **Component Structure:** React components are organized within the `src/components` and `src/pages` directories.
*   **API Integration:** Firebase and Supabase clients are configured in `src/firebase.jsx` and `src/lib/supabaseClient.ts` respectively.
*   **Routing:** `react-router-dom` is used for client-side routing.
