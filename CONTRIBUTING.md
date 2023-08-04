Build `vike-react`:

```bash
git clone git@github.com:brillout/vike-react
cd vike-react/ && pnpm install
pnpm build
```

> Note that:
>
> - You'll need [pnpm](https://pnpm.io/) which you can install with `$ npm install -g pnpm`.
> - Windows may or may not work.
>
> These requirements only hold for developing `vike-react`: the npm package `vike-react` can be used with Windows and any package manager.

You can then test your modifications against an example, e.g. `examples/basic/`:

```bash
cd examples/basic/
pnpm dev
```
