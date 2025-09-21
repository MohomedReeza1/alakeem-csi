from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, feedback, admin

app = FastAPI(
    title="CSI Feedback API",
    description="Backend for Customer Service Index Web App",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# "http://localhost:5173",
# "https://alakeem-csi.vercel.app/",

# Routers
app.include_router(auth.router)
app.include_router(feedback.router)
app.include_router(admin.router, prefix="/api")

# Health check
@app.get("/")
def read_root():
    return {"message": "CSI Feedback API is running."}
