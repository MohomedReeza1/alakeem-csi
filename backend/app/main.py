from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, feedback

app = FastAPI(
    title="CSI Feedback API",
    description="Backend for Customer Service Index Web App",
    version="1.0.0",
)

# CORS configuration
# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "https://your-frontend-domain.vercel.app",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://alakeem-csi.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(feedback.router)

# Health check
@app.get("/")
def read_root():
    return {"message": "CSI Feedback API is running."}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, feedback

app = FastAPI(
    title="CSI Feedback API",
    description="Backend for Customer Service Index Web App",
    version="1.0.0",
)

# CORS configuration
# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "https://your-frontend-domain.vercel.app",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://alakeem-csi.vercel.app",
                   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(feedback.router)

# Health check
@app.get("/")
def read_root():
    return {"message": "CSI Feedback API is running."}
