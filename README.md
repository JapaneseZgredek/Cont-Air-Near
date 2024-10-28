
# FastAPI & React Basic App

This project is a basic web application using FastAPI for the backend and HTML served from a frontend folder. It demonstrates how to set up a basic structure where HTML and static assets are served by FastAPI.

## Project Structure

```
/project-root
│
├── /backend
│   ├── main.py                # Main FastAPI app file with endpoint serving frontend HTML
│   └── requirements.txt       # Backend dependencies
│
├── /frontend
│   ├── /static                # Folder for static assets (CSS, JS, etc.)
│   │   ├── style.css
│   │   ├── script.js
│   ├── index.html             # Main HTML file for the frontend
│   └── README.md              # Optional readme for frontend
│
└── README.md                  # Main README file
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
   pip pinstall uvicorn
   ```

## Running the Project

1. **Start the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload
   ```

2. **Access the application**:

   Open your browser and navigate to `http://127.0.0.1:8000`. You should see an HTML page served by FastAPI from the `frontend` folder.

## Folder Details

- **`/backend/main.py`**: Contains the FastAPI app and serves the frontend HTML file and static assets.
- **`/frontend/index.html`**: The main HTML file rendered by FastAPI.
- **`/frontend/static/`**: Contains static files like CSS and JavaScript used by `index.html`.
