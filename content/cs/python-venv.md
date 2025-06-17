---
title: Python virtual environments
date: 2024-06-11
---
This cheatsheet is addressed to Polytechnique students I met during IT support sessions.

From Princeton university website :
> [!quote] Virtual environments let you have a stable, reproducible, and portable environment. You are in control of which packages versions are installed and when they are upgraded.

It is useful when switching between projects of different classes, each of them might be requiring different dependencies versions. You can check them on the [school’s JupyterHub](https://jupytercloud.idcs.polytechnique.fr/jupyter/hub/spawn).

To create the virtual environment, at the root of the project (might be `python3`) :
```bash
python -m venv venv
```

You need to activate the environment every time you want to use it.

| Linux & macOS | Windows |
| :--: | :--: |
| `source venv/bin/activate{:bash}` | `.\venv\Scripts\activate{:powershell}` |

Now, `venv` should be written somewhere on your command line prompt.

Once your environment is active you can use `pip` normally (`pip install`, …). With `pip` , you can also :
- list dependencies currently installed :
  ```bash
  pip freeze > requirements.txt
  ```
- install dependencies from a `requirements.txt` file :
  ```bash
  pip install -r requirements.txt
  ```

> [!info] Additional tooling
> I'd recommend using [uv](https://github.com/astral-sh/uv) to manage both your Python versions and environments.

