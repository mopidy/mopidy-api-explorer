import pathlib
from importlib.metadata import version
from typing import override

from mopidy import config, ext

__version__ = version("mopidy-api-explorer")


class Extension(ext.Extension):
    dist_name = "mopidy-api-explorer"
    ext_name = "api_explorer"
    version = __version__

    @override
    def get_default_config(self) -> str:
        return config.read(pathlib.Path(__file__).parent / "ext.conf")

    @override
    def setup(self, registry: ext.Registry) -> None:
        registry.add(
            "http:static",
            {
                "name": self.ext_name,
                "path": str(pathlib.Path(__file__).parent / "static"),
            },
        )
