from ninja.testing import TestClient

from core.api import health


def test_live_endpoint() -> None:
    # Arrange
    client = TestClient(health.router)

    # Act
    response = client.get("/live")

    # Assert
    assert response.status_code == 200
    assert response.text == '"live"'
