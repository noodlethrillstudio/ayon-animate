from typing import Any

from ayon_server.addons import BaseServerAddon

from .settings import (
    DEFAULT_ANIMATE_SETTING,
    AnimateSettings,
)


class Animate(BaseServerAddon):
    settings_model = AnimateSettings

    async def get_default_settings(self):
        settings_model_cls = self.get_settings_model()
        return settings_model_cls(**DEFAULT_ANIMATE_SETTING)

    async def convert_settings_overrides(
        self,
        source_version: str,
        overrides: dict[str, Any],
    ) -> dict[str, Any]:
        convert_settings_overrides(source_version, overrides)
        return await super().convert_settings_overrides(
            source_version, overrides
        )
