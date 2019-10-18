# Developer Guidelines

## Setting up the test data

The `schema/deploy-test-data.sh` script allows you to set up you database schemas, and populate it with dummy data.

### Prerequisites
- Start your postgres database (`pg_ctl start` if you installed it with `asdf`)
- Initialize the `schema/.cas-ggircs` [submodule] (`git submodule init && git submodule update`)

### Deploying the data

`make deploy_test_data` will drop the existing database if it exists and recreate it using the current deployment files.

Run `./.bin/deploy-test-data.sh --help` to learn about other available options.


## Code style and Linting

We use [XO](https://github.com/xojs/xo) to lint the app's code. The following yarn scripts can be used to trigger formatting and linting:

 - `yarn lint`: Runs xo and prints all the errors and warnings
 - `yarn format`: Same as above, but also reformats the code using Prettier

### VSCode plugin

The `linter-xo-2` VSCode add XO support. The following VSCode settings will enable XO and make sure you code is properly formatted whenever you save a file:

```json
{
    "xo.enable": true,
    "xo.format.enable": true,
    "editor.formatOnSave": true
}
```
## Pre-commit hooks

The Yelp [pre-commit](https://pre-commit.com) framework is configured for this project
to automatically dispatch multi-language pre-commit hooks. Wherever possible,
non-destructive linting steps will automatically fix common errors in staged code
either when explicitly running `pre-commit` or automatically via the
[git hook](https://git-scm.com/docs/githooks).

Installation:
- `asdf plugin-list` If any of the `yarn` `nodejs` `postgres` & `python` plugins are not listed install with asdf plugin-add <plugin>
- `asdf install` (grab the python version specified in `.tool-versions`...but any python should do)
- `pip install -r requirements.txt` (install pre-commit via pip...mac users might prefer homebrew)
- `asdf reshim` (ensure all pip-installed tools are available on the path...ignore if using system python)
- `pre-commit install` (create the `.git/hooks/pre-commit` file to run pre-commit automatically)
- If pre-commit install fails, try installing sqlite3 with `sudo apt-get install libsqlite3-dev` then `asdf uninstall python` then `asdf install`

## Filesystem Watchers

We use [Watchman] to recursively monitor our directory trees and dispatch
lifecycle jobs as needed. We define triggers using the [extended json syntax]
and commit these configuration files to the project. To start all triggers, run
`make watch` and to stop watching run `make unwatch`.

The logs for all watched processes can be found in the `logs/` directory, and
are overwritten on each restart of the triggered process. Certain additional
state files are also stored in this folder. Notably, `sqitch.status` records
the change hash currently deployed via watchman trigger to the local database
and `server.pid` records the process id of the node app server run via watchman.

To easily monitor all of the log files, you can use a program such as [multitail]. For instance, if you want to output all of the `sdtdout` files in your terminal, split into two columns, you can do the following:
`$ multitail -f -s 2 *.stdout.log`

Running `make unwatch` will stop both the node app server and the asdf-managed
local postgres server.

[Watchman]: https://facebook.github.io/watchman/
[extended json syntax]: https://facebook.github.io/watchman/docs/cmd/trigger.html#extended-syntax
[multitail]: https://linux.die.net/man/1/multitail
[submodule]: https://git-scm.com/book/en/v2/Git-Tools-Submodules