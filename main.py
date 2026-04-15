from fastapi import FastAPI
from app.database import engine
from app import models
from routers import purchase, sales

from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(purchase.router)
app.include_router(sales.router)


@app.get("/")
def home():
    return {"message": "Sales and Purchase Management Running"}