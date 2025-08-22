# Simple Task Explorer

A minimal VS Code extension that provides a sidebar view for managing VS Code tasks. List, run, and stop tasks directly from the Task Explorer sidebar.

## Features

- **Simple Task List**: View all available tasks (both configured and detected) in a clean sidebar
- **One-Click Actions**: Run tasks with the play button (▶) or stop running tasks with the stop button (⏹)
- **Multi-root Support**: Handles multi-root workspaces with folder prefixes on name collision
- **Real-time Updates**: Task status updates automatically when tasks start/stop
- **Refresh**: Manual refresh available via the refresh button (🔄)

## Usage

1. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run "Simple Task Explorer: Open View" or find the Task Explorer in the Activity Bar
3. See all your tasks listed with terminal icons
4. Click ▶ to run a task or ⏹ to stop a running task
5. Use 🔄 to refresh the task list

## Configuration

- `simpleTaskExplorer.stopAllMatchingExecutions` (boolean, default: `true`): When stopping a task, terminate all executions with the same definition. If false, stop only the most recent execution.

## Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` to launch the Extension Development Host
4. Test the extension in the new VS Code window

### Development Commands

- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `npm run package` - Create .vsix package for testing
- `npm run publish:check` - Validate build and create package

### Testing the Extension

1. Create a `.vscode/tasks.json` file in your test workspace:
   ```bash
   cp .vscode/sample-tasks.json.example .vscode/tasks.json
   ```
2. Open the Task Explorer from the Activity Bar
3. Test running and stopping tasks
4. Verify only workspace-defined tasks appear (no npm scripts or auto-detected tasks)

## Publishing to OpenVSX

This extension is designed to be published to the OpenVSX Registry (open-source alternative to VS Code Marketplace).

### Prerequisites

1. **Install required tools:**
   ```bash
   npm install -g @vscode/vsce ovsx
   ```

2. **Get an OpenVSX Personal Access Token:**
   - Visit [OpenVSX Registry](https://open-vsx.org/)
   - Sign in with GitHub
   - Go to your profile settings
   - Generate a new Access Token with publish permissions

3. **Update package.json fields:**
   ```json
   {
     "publisher": "your-publisher-name",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/simple-task-explorer"
     }
   }
   ```

### Publishing Methods

#### Method 1: Automated Script (Recommended)

```bash
# Set your OpenVSX token
export OVSX_PAT=your_access_token_here

# Run the publishing script
./scripts/publish.sh
```

The script will:
- ✅ Validate dependencies and environment
- ✅ Check for uncommitted changes
- ✅ Compile and package the extension
- ✅ Publish to OpenVSX Registry

#### Method 2: Manual Publishing

```bash
# Compile and package
npm run compile
npm run package

# Publish to OpenVSX
ovsx publish simple-task-explorer-*.vsix -p YOUR_TOKEN
```

#### Method 3: Step-by-step

```bash
# 1. Install dependencies
npm install

# 2. Compile TypeScript
npm run compile

# 3. Create package
vsce package

# 4. Publish to OpenVSX
ovsx publish simple-task-explorer-0.1.0.vsix -p YOUR_TOKEN
```

### Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass and extension works correctly
- [ ] Version number is updated in `package.json`
- [ ] `CHANGELOG.md` is updated (if you have one)
- [ ] All changes are committed to git
- [ ] `publisher` field is set in `package.json`
- [ ] Repository URL is correct in `package.json`
- [ ] Extension has been tested in a clean VS Code environment

### Version Management

Update the version before publishing:

```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0)  
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major
```

### Publishing Troubleshooting

**Common Issues:**

1. **"Publisher not found"**: Register as a publisher on OpenVSX first
2. **"Invalid token"**: Check your OVSX_PAT environment variable
3. **"Version already exists"**: Update version in package.json
4. **Package validation errors**: Run `npm run publish:check` to identify issues

**Getting Help:**

- Check the [OpenVSX documentation](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- Verify your package with `vsce package --out test.vsix` before publishing

## License

MIT