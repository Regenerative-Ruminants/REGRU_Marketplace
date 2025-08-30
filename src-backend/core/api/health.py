from django.http import HttpRequest
from ninja import Router

router = Router()


@router.get("/live")
def live(request: HttpRequest) -> str:  # noqa: ARG001
    return "live"
