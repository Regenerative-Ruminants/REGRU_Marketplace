import uuid
from abc import ABC, abstractmethod

from core.test.unit.services.test_traceability_service import ProductTraceDAG


class TraceabilityService(ABC):
    @abstractmethod
    def get_product_dag(self, product_id: uuid.UUID) -> ProductTraceDAG:
        """Get the traceability DAG for the given ``product_id``

        Parameters
        ----------
        product_id
            Product UUID as exists within the REGRU API

        Returns
        -------
        ProductTraceDAG
            DAG object illustrating a product trace to its origin.
        """
        ...
