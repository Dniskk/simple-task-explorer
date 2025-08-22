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

### Commands

- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development

## Publishing

This extension is designed to be published to OpenVSX:

```bash
npm install -g ovsx
vsce package
ovsx publish simple-task-explorer-0.1.0.vsix -p YOUR_TOKEN
```

## License

MIT