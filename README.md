
# Antrian Simple: Real-time Queue Display (Frontend)

This repository contains the Next.js frontend application for **Antrian Simple**, a real-time queue management and display system. This application provides a dynamic display of counter statuses and allows designated users (Counters) to manage their queues, while administrators have full control over counter configurations.

----------

## Features

-   **Real-time Counter Display:** Live updates of all active counter statuses and current queue numbers via WebSockets, suitable for large displays.
-   **Role-Based Dashboards:**
    -   **Counter Dashboard:** Users with "Counter" roles can increment their current queue number and skip numbers.
    -   **Admin Dashboard:** Users with "Admin" roles can manage (add, edit, delete) counters.
-   **Unified Login:** A single login page (`/login`) for all authenticated users.
-   **Responsive UI:** Designed to work across various screen sizes (for display monitors, counter tablets, and admin desktops).
-   **Seamless Integration:** Connects with a separate Go backend for data management and WebSocket communication.

----------

## Prerequisites

Before running this frontend application, ensure you have the following installed:

-   **Node.js**: `v18.x` or higher (LTS recommended)
-   **npm**: `v9.x` or higher (or Yarn `v1.22.x` or higher)
-   **Antrian Simple Go Backend**: This frontend requires the Antrian Simple Go backend to be running and accessible. Please refer to the backend's `README.md` for its installation and setup instructions. Ensure your backend handles user authentication and role management.

----------

## Installation

Follow these steps to set up and run the frontend application locally:

1.  **Clone the repository:**
    
    Bash
    
    ```
    git clone https://github.com/AdMFirst/antrian-simple.git
	cd antrian-simple
    ```


3.  **Install dependencies:**
    

    ```
    npm install
    # or yarn install
    ```
    
5.  **Configure Environment Variables:**
    Create a .env.local file in the root of the project and add the following:
    
    ```
    NEXT_PUBLIC_API_BASE=http://localhost:4000
    NEXT_PUBLIC_API_WS=ws://localhost:4000
    ```
    
    -   **`NEXT_PUBLIC_API_BASE`**: The base URL for your Go backend's REST API, used for authentication and data management.
    -   **`NEXT_PUBLIC_API_WS`**: The WebSocket endpoint for real-time updates.
    
    **Note:** Ensure these URLs match the actual address where your Go backend is running.
    
6.  **Run the development server:**
    

    ```
    npm run dev
    # or yarn dev 
    ```
    
    The application will typically be accessible at `http://localhost:3000`.
    

----------

## UI Documentation

### Accessing Interfaces

-   **Live Display:** Access the main public live display at the root URL (e.g., `http://localhost:3000`). This view automatically updates with the latest queue information and is ideal for large screens or dedicated display monitors.
-   **Login Page:** All authenticated users (Counters and Admins) log in via the `/login` route (e.g., `http://localhost:3000/login`).
-   **Dashboard:** After successful login, users are redirected to the `/dashboard` route (e.g., `http://localhost:3000/dashboard`). The content and functionality displayed on this page will differ based on the user's role (Counter or Admin).

### Core Workflows

#### Live Display

The primary public view displays all active counters and their current serving numbers. This view updates in real-time via WebSockets as counters process their queues, providing an up-to-the-minute view for waiting customers.

#### User Authentication

Users navigate to `/login`, where they provide their credentials. Upon successful authentication with the Go backend, they are redirected to `/dashboard`.

#### Role-Based Dashboard (`/dashboard`)

-   Counter Dashboard:
    
    If the logged-in user has a "Counter" role, the /dashboard displays their specific interface. Here, they can:
    
    -   **"Next" Button:** Increments their current serving number to call the next customer in the queue.
    -   **"Skip" Button:** Allows the counter to skip the current number, moving to the next available number without incrementing if a customer is not present or special handling is required.
    -   **"Reset" Button:** Turn the current number on the counter to 0, allowing the queue to reset for the next shift or day.
    -   _Note: Each counter might be assigned to a specific physical counter or ID, and their dashboard will reflect this._
-   Admin Dashboard:
    
    If the logged-in user has an "Admin" role, the /dashboard displays the administrative interface. This allows for full control over the system's counters:
    
    -   **Add Counter:** A form to create a new counter, allowing administrators to assign a unique name or identifier.
    -   **Edit Counter:** Modify existing counter details, such as changing its name.
    -   **Delete Counter:** Remove a counter from the system.
    -   _Note: The admin dashboard provides an overview and management tools for all counters._

----------

## Developer Documentation

### Key Technologies

-   **Next.js**: React framework for production-ready applications, utilizing the App Router for routing.
-   **React**: Core UI library for building dynamic user interfaces.
-   **TypeScript**: For enhanced code quality, type safety, and better developer experience.
-   **Tailwind CSS / CSS Modules (or similar)**: For modular and efficient styling.


### API Interaction

The frontend communicates with the Antrian Simple Go backend using two primary methods:

-   **REST API:** Utilized for user authentication (`/login`) and administrative functionalities (`/dashboard` for Admin role) such as creating, reading, updating, and deleting counter configurations. Authentication tokens (e.g., JWTs) are expected to be exchanged and managed for secure API access.
-   **WebSockets:** Employed for real-time updates to the live public display (`/`) and immediate feedback for counter operations on the `/dashboard` (for Counter role), ensuring a dynamic user experience.


----------

## Dependencies

This project relies on the following key dependencies, managed via `package.json`:

-   `next`: The foundational Next.js framework.
-   `react`, `react-dom`: Core libraries for building user interfaces with React.
-   `typescript`: Provides static type checking for a more robust codebase.


----------

## Notes

-   This frontend application is designed to be deployed independently of the Go backend.
-   It is crucial to correctly configure the `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_API_WS` environment variables to point to your running Go backend instance.
-   The Go backend is responsible for handling user authentication, generating authentication tokens (e.g., JWTs), and enforcing role-based access control. The frontend will consume these APIs and manage the user session accordingly.

----------

## License

This project is licensed under GNU General Public License v3.0. - see the LICENSE.md file for more details.

----------

## Closing Note

Thank you for exploring **Antrian Simple Frontend**! We hope this application provides a clear and efficient real-time solution for queue management. If you have any questions, feedback, or would like to contribute, please feel free to open an issue on the [GitHub repository](https://github.com/AdMFirst/antrian-simple).
