from fastapi import APIRouter

router = APIRouter()


@router.get("", summary="Health check")
def get_health() -> dict[str, str]:
    return {"status": "ok"}
