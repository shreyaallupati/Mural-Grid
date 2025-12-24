# Instructions to run the StencilApp

The frontend and backend are now connected. To run the application, you need to install the dependencies and run the servers for both the frontend and the backend.

## Backend (stencil-backend)

1.  Navigate to the backend directory:
    ```bash
    cd stencil-backend
    ```
2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```
3.  Activate the virtual environment:
    ```bash
    source venv/bin/activate
    ```
4.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://localhost:8000`.

## Frontend (my-stencil-app)

1.  Navigate to the frontend directory:
    ```bash
    cd my-stencil-app
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

You can now open your browser to `http://localhost:5173` and use the application.
