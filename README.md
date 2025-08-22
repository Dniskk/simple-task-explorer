# Simple Task Explorer

A minimal VS Code extension that provides a sidebar view for managing VS Code workspace tasks. View, run, and stop tasks directly from the Task Explorer sidebar.

## Features

- **Simple Task List**: View all workspace-defined tasks in a clean sidebar
- **One-Click Actions**: Run tasks with the play button (▶) or stop running tasks with the stop button (⏹)
- **Multi-root Support**: Handles multi-root workspaces with folder prefixes when needed
- **Real-time Updates**: Task status updates automatically when tasks start/stop
- **Workspace Tasks Only**: Shows only tasks from `tasks.json` or `.code-workspace` files (no auto-detected npm scripts)

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/simple-task-explorer.git
   cd simple-task-explorer
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run compile
   ```

3. Install the extension:
   ```bash
   npm run package
   code --install-extension simple-task-explorer-*.vsix
   ```

### From OpenVSX Registry

*Coming soon - extension will be published to OpenVSX*

## Usage

1. Open the Task Explorer from the Activity Bar (look for the terminal icon)
2. See all your workspace tasks listed
3. Click ▶ to run a task or ⏹ to stop a running task
4. Use 🔄 to refresh the task list

**Note**: Only tasks defined in `.vscode/tasks.json` or `.code-workspace` files will appear. Auto-detected tasks (like npm scripts) are not shown.

## Configuration

- `simpleTaskExplorer.stopAllMatchingExecutions` (boolean, default: `true`): When stopping a task, terminate all executions with the same definition. If false, stop only the most recent execution.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and publishing instructions.

## License

MIT