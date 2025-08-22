# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a VS Code extension called "Simple Task Explorer" that provides a minimal sidebar view for managing VS Code tasks. The extension allows users to list, run, and stop tasks directly from the sidebar without advanced features.

## Key Requirements from PRD
- Create a sidebar view called "Task Explorer" in the Activity Bar
- List all tasks from `vscode.tasks.fetchTasks()` (both configured and detected)
- Provide run (▶) and stop (⏹) actions for tasks
- Include refresh (🔄) functionality
- Support multi-root workspaces with folder prefixes on name collision
- Publish to OpenVSX (not VS Code Marketplace)
- Minimal configuration: only `simpleTaskExplorer.stopAllMatchingExecutions` boolean

## Extension Structure
When developing this extension, follow the typical VS Code extension structure:
- `package.json` - Extension manifest with contributes, commands, and configuration
- `src/extension.ts` - Main extension entry point with activate/deactivate functions
- `src/taskProvider.ts` - TreeDataProvider implementation for task listing
- `src/taskItem.ts` - TreeItem class for individual tasks
- Use TypeScript for all source files

## Core VS Code APIs to Use
- `vscode.tasks.fetchTasks()` - Get all available tasks
- `vscode.tasks.executeTask()` - Run tasks
- `vscode.tasks.taskExecutions` - Track running tasks
- `vscode.tasks.onDidStartTask` / `vscode.tasks.onDidEndTask` - Task lifecycle events
- `vscode.TreeDataProvider` - Sidebar tree view implementation
- `vscode.window.createTreeView()` - Create the sidebar view

## Development Commands
Once the extension is scaffolded, these commands will be relevant:
- `npm install` - Install dependencies
- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `F5` in VS Code - Launch Extension Development Host for testing
- `vsce package` - Package extension for publishing
- `ovsx publish` - Publish to OpenVSX

## Package.json Key Contributions
- `contributes.viewsContainers.activitybar` - Add "Task Explorer" container
- `contributes.views` - Register `simpleTaskExplorer.view`
- `contributes.commands` - Register refresh, run, stop, and openView commands  
- `contributes.menus.view/item/context` - Add context menu actions
- `activationEvents` - Activate on view opening or commands
- `engines.vscode` - Target VS Code API version ^1.90.0 or newer

## Implementation Notes
- Use TreeDataProvider with flat list structure (no hierarchical grouping)
- Map tasks by stable ID (folder + name + definition type) for run/stop operations
- Handle task execution state with contextValue for conditional menu items
- Implement proper error handling with `vscode.window.showErrorMessage`
- Ensure performance target of <300ms initial load
- Use VS Code theme icons only, no custom styling

## Testing Approach
Test the extension using the Extension Development Host (F5) with various scenarios:
- Single and multi-root workspaces
- Different task types (npm, shell, etc.)
- Running and stopping tasks
- Refresh functionality
- Error conditions