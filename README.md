
## Cont-Air-Near

A CMS project built with FastAPI and React for managing shipping operations. This project enables CRUD operations on ships, integrates a frontend with FastAPI, and serves static assets.

## Project Structure

```
Cont-Air-Near/
├── backend/
│   ├── main.py                # Main FastAPI application entry point
│   ├── database.py            # Database configuration and session management
│   ├── models/                # Directory for all SQLAlchemy models
│   │   └── ship.py            # Ship model definition
│   ├── routes/                # Directory for API route definitions
│   │   └── ship.py            # CRUD endpoints for Ship model
│   ├── __init__.py            # Initializes the backend package
│   └── requirements.txt       # Backend dependencies
│
├── frontend/
│   ├── static/                # Static assets (CSS, JS)
│   │   ├── style.css          # Styling for the frontend
│   │   ├── script.js          # JavaScript for the frontend
│   ├── index.html             # Main HTML file for frontend
│   └── README.md              # Frontend-specific readme
│
├── .gitignore                 # Git ignore file
├── LICENSE                    # License for the project
├── README.md                  # Project readme (this file)
└── test.db                    # SQLite database file
```

## Prerequisites

- **Python 3.7+**
- **pip** for package management

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JapaneseZgredek/Cont-Air-Near.git
   cd Cont-Air-Near
   ```

2. **Install the backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   pip install uvicorn
   ```

## Running the Project

1. **Start the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload
   ```

2. **Start npm***
   ```bash
      cd /frontend
      npm start
   ```

3. **Access the application**:

   Open your browser and navigate to `http://127.0.0.1:8000`. You should see an HTML page served by FastAPI from the `frontend` folder.

## API Endpoints

- **`POST /api/ships/`**: Creates a new ship entry in the database.
- **`GET /api/ships/{id_ship}`**: Retrieves a specific ship by ID.
- **`GET /api/ships/`**: Retrieves a list of all ships in the database.
- **`PUT /api/ships/{id_ship}`**: Updates details of an existing ship by ID.
- **`DELETE /api/ships/{id_ship}`**: Deletes a ship from the database by ID.

## File Details

- **`/backend/main.py`**: The entry point for the FastAPI application, which registers routes and configures the server.
- **`/backend/database.py`**: Manages the database connection, configuration, and session handling for SQLite.
- **`/backend/models/ship.py`**: Defines the `Ship` model with fields such as `id_ship`, `name`, `capacity`, and `status`.
- **`/backend/routes/ship.py`**: Implements CRUD API routes for managing ship records.
- **`/frontend/index.html`**: The main HTML file served by FastAPI for the frontend interface.
- **`/frontend/static/`**: Contains supporting files like CSS (`style.css`) and JavaScript (`script.js`) used by `index.html`.

## Additional Notes

- **Database Configuration**: The project uses SQLite (`test.db`) by default. To change the database, update `SQLALCHEMY_DATABASE_URL` in `database.py`.
- **Testing**: You can FastAPI’s built-in Swagger UI (`http://127.0.0.1:8000/docs`) to test each API endpoint.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
