# Simple Task Explorer

A sidebar view for workspace tasks. Shows only tasks from `tasks.json` and `.code-workspace` files.

## Features

- View tasks from `.vscode/tasks.json` or `.code-workspace` files
- Run and stop tasks with one click
- Real-time status updates for running tasks
- Works with multi-root workspaces
- No auto-detected npm scripts or extension tasks

## Usage

1. Find Task Explorer in the Activity Bar
2. Click ▶ to run a task
3. Click ⏹ to stop a running task
4. Click 🔄 to refresh

## Configuration

`simpleTaskExplorer.stopAllMatchingExecutions` (default: `true`) - Stop all matching executions instead of just the most recent one.

Change in VS Code settings: search for "Simple Task Explorer".