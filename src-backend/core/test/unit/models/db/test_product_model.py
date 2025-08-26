import uuid

from core.models.db import Product


def test_product_uuid_is_auto_created() -> None:
    """
    Test that the UUID field is automatically created on model instantiation.
    """
    # Create a new Product instance directly without saving it to the database
    # This calls the model's __init__ method, which is where Django's auto_add field
    # handling takes place.
    product = Product(name="Test Product")

    # The UUID should be generated as part of the model's __init__
    # before it's saved to the database.
    assert product.uid is not None

    # Assert that the created uuid is a valid UUID object
    assert isinstance(product.uid, uuid.UUID)

    # You can also verify that it's a UUID4
    assert product.uid.version == 4
