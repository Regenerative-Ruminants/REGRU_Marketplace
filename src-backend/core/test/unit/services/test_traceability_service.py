import uuid

import pytest

from core.models.autonomi import ProductTraceDAG
from core.services.traceability_service import TraceabilityService


class TestTraceabilityService(TraceabilityService):
    def get_product_dag(self, product_id: uuid.UUID) -> ProductTraceDAG:
        return ProductTraceDAG(product_id=product_id, nodes=[])


@pytest.fixture
def test_traceability_service() -> TestTraceabilityService:
    return TestTraceabilityService()


@pytest.fixture(params=["test"])
def service(request: pytest.FixtureRequest) -> TraceabilityService:
    match request.param:
        case "test":
            return TestTraceabilityService()
        case _:
            return TestTraceabilityService()


def test_get_product_dag(service: TraceabilityService) -> None:
    # Arrange
    product_id = uuid.UUID(int=1)

    # Act
    dag = service.get_product_dag(product_id)

    # Assert
    assert dag is not None
    assert isinstance(dag, ProductTraceDAG)
    assert dag.product_id == product_id
