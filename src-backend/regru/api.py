from ninja import NinjaAPI

from core.api import health

api = NinjaAPI()

api.add_router("/health/", health.router)
