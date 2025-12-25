# mopidy-api-explorer

[![Latest PyPI version](https://img.shields.io/pypi/v/mopidy-api-explorer)](https://pypi.org/p/mopidy-api-explorer)
[![CI build status](https://img.shields.io/github/actions/workflow/status/mopidy/mopidy-api-explorer/ci.yml)](https://github.com/mopidy/mopidy-api-explorer/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/gh/mopidy/mopidy-api-explorer)](https://codecov.io/gh/mopidy/mopidy-api-explorer)

[Mopidy](https://mopidy.com/) extension which lets you explore the JSON-RPC API.


## Installation

Install by running:

```sh
python3 -m pip install mopidy-api-explorer
```


## Usage

Once the extension is installed, Mopidy must be restarted to detect the extension.
After restarting Mopidy, visit the following URL to explore the Mopidy JSON-RPC API:

  http://localhost:6680/api_explorer/


## Project resources

- [Source code](https://github.com/mopidy/mopidy-api-explorer)
- [Issues](https://github.com/mopidy/mopidy-api-explorer/issues)
- [Releases](https://github.com/mopidy/mopidy-api-explorer/releases)


## Development

### Set up development environment

Clone the repo using, e.g. using [gh](https://cli.github.com/):

```sh
gh repo clone mopidy/mopidy-api-explorer
```

Enter the directory, and install dependencies using [uv](https://docs.astral.sh/uv/):

```sh
cd mopidy-api-explorer/
uv sync
```

### Running tests

To run all tests and linters in isolated environments, use
[tox](https://tox.wiki/):

```sh
tox
```

To only run tests, use [pytest](https://pytest.org/):

```sh
pytest
```

To format the code, use [ruff](https://docs.astral.sh/ruff/):

```sh
ruff format .
```

To check for lints with ruff, run:

```sh
ruff check .
```

To check for type errors, use [pyright](https://microsoft.github.io/pyright/):

```sh
pyright .
```

### Making a release

To make a release to PyPI, go to the project's [GitHub releases
page](https://github.com/mopidy/mopidy-api-explorer/releases)
and click the "Draft a new release" button.

In the "choose a tag" dropdown, select the tag you want to release or create a
new tag, e.g. `v0.1.0`. Add a title, e.g. `v0.1.0`, and a description of the changes.

Decide if the release is a pre-release (alpha, beta, or release candidate) or
should be marked as the latest release, and click "Publish release".

Once the release is created, the `release.yml` GitHub Action will automatically
build and publish the release to
[PyPI](https://pypi.org/project/mopidy-api-explorer/).


## Credits

- Original author: [Janes Troha](https://github.com/dz0ny)
- Current maintainer: [Matthew Gamble](https://github.com/djmattyg007)
- [Contributors](https://github.com/mopidy/mopidy-api-explorer/graphs/contributors)
