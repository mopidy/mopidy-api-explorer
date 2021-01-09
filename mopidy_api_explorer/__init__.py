import pathlib

import pkg_resources

from mopidy import config, ext


__version__ = pkg_resources.get_distribution("Mopidy-API-Explorer").version
__url__ = "https://github.com/dz0ny/mopidy-api-explorer"

ext_dir = pathlib.Path(__file__).parent


class Extension(ext.Extension):
    dist_name = "Mopidy-API-Explorer"
    ext_name = "api_explorer"
    version = __version__

    def get_default_config(self):
        return config.read(ext_dir / "ext.conf")

    def setup(self, registry):
        registry.add(
            "http:static",
            {
                "name": self.ext_name,
                "path": ext_dir / "static",
            },
        )
