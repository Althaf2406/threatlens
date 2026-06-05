# Frontend Build Troubleshooting

## Next.js TypeScript OOM (Out Of Memory) Error

When building the ThreatLens frontend, you might encounter an Out-Of-Memory (OOM) error on the V8 engine during TypeScript typechecking.
This usually happens because `next build` spawns worker threads that exceed Node.js default memory limits when analyzing the codebase.

### Symptoms
The build process fails with an error similar to:
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

### Solution

You can allocate more memory to the Node.js process using the `NODE_OPTIONS` environment variable.

#### On Windows PowerShell
Set the variable before running the build command. We recommend starting with 4096 MB (4 GB), and increasing to 8192 MB (8 GB) if it still fails.

```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

Or for 8GB:
```powershell
$env:NODE_OPTIONS="--max-old-space-size=8192"
pnpm build
```

#### On Linux / macOS
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Using the Package Script
We have added a custom `build:memory` script in `package.json` for convenience. However, you still need to pass the environment variable if you run it locally:

```powershell
$env:NODE_OPTIONS="--max-old-space-size=8192"
pnpm run build:memory
```

> **Note:** Never disable TypeScript checking (`ignoreBuildErrors: true`) to bypass this issue, as it defeats the purpose of type safety. Always fix the underlying type errors or increase the memory limit.
