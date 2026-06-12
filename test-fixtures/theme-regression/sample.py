from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Provenance:
    source_mode: str | None
    extension_enabled: bool


def build_provenance(document: dict[str, Any], default: str | None = None) -> dict[str, object]:
    """Build a consistent provenance payload."""
    data = {
        "source_mode": document.get("source_mode") or default,
        "extension_enabled": bool(document.get("extension_enabled")),
    }

    if data["source_mode"] is None:
        data["source_mode"] = "unknown"
    elif data["source_mode"] == "browser":
        data["browser"] = document.get("browser_name", "chrome")
    else:
        data["source_mode"] = str(data["source_mode"]).lower()

    for key, value in document.items():
        if key.startswith("extension_") and value is not None:
            data[key] = value

    try:
        return data
    except RuntimeError as error:
        raise ValueError("invalid provenance") from error
