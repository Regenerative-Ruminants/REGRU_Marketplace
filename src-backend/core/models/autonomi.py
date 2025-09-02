import uuid
from enum import StrEnum, auto

from pydantic import AwareDatetime, BaseModel


class EventType(StrEnum):
    TRANSACTION = auto()
    PROCESSING = auto()
    ORIGIN = auto()


class TraceNodeDataModel(BaseModel):
    """Data model for data stored at each node in a traceability graph"""

    product_id: uuid.UUID
    order_id: uuid.UUID | None
    company_id: uuid.UUID
    created_at: AwareDatetime
    event_type: EventType


class TraceNode(BaseModel):
    """Data model for each node in a traceability graph"""

    parents: list["TraceNode"]
    data: TraceNodeDataModel


class ProductTraceDAG(BaseModel):
    product_id: uuid.UUID
    nodes: list[TraceNodeDataModel]
