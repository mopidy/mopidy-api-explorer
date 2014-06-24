from __future__ import unicode_literals

import os

from mopidy import ext, config


__version__ = '1.0.0'
__url__ = 'https://github.com/dz0ny/mopidy-api-explorer'


class APIExplorerExtension(ext.Extension):
    dist_name = 'Mopidy-API-Explorer'
    ext_name = 'api_explorer'
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super(APIExplorerExtension, self).get_config_schema()
        return schema

    def setup(self, registry):
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'public'),
        })
