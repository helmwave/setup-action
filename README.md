# setup-action

Install a specific version of helmwave binary on the runner.

Documentation: https://docs.helmwave.app

```yaml
- uses: helmwave/setup-action@v0.3.0
  with:
    version: '0.28.0'
  id: install
```

## Example

```yaml
name: CI
on:
  push:


jobs:
  external:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: helmwave/setup-action@v0.2.0
        name: Install helmwave
        with:
          version: '0.28.0'
      - run: helmwave --version
      - run: helmwave yml
      - run: helmwave up --build
      
```
