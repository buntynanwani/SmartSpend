"""
SmartSpend API — Main application entry point.
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import engine, Base
from app.routers import users, products, shops, purchases


# Create database tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Personal expense tracking system",
    docs_url="/docs",
    redoc_url="/redoc",
)


# ── Detailed 422 error logging ───────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Log the exact Pydantic validation errors to the console."""
    print(f"\n{'='*60}")
    print(f"422 VALIDATION ERROR on {request.method} {request.url}")
    print(f"{'='*60}")
    for err in exc.errors():
        print(f"  Field : {' -> '.join(str(loc) for loc in err['loc'])}")
        print(f"  Type  : {err['type']}")
        print(f"  Msg   : {err['msg']}")
        print(f"  Input : {err.get('input', 'N/A')}")
        print(f"  ---")
    # Also log the raw body that was received
    body = exc.body
    print(f"  Raw body: {body}")
    print(f"{'='*60}\n")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(body)},
    )


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(shops.router, prefix="/shops", tags=["Shops"])
app.include_router(purchases.router, prefix="/purchases", tags=["Purchases"])


@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
