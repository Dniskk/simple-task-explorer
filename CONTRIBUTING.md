# Contributing to Simple Task Explorer

Thank you for your interest in contributing to Simple Task Explorer! This document provides guidelines for development, testing, and publishing.

## Development Setup

### Prerequisites

- Node.js (version 20.x or later)
- VS Code
- Git

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/simple-task-explorer.git
   cd simple-task-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run compile
   ```

## Development Workflow

### Available Commands

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development (auto-compile on changes)
- `npm run package` - Create .vsix package for testing
- `npm run publish:check` - Validate build and create package
- `npm run publish:openvsx` - Publish to OpenVSX (requires token)

### Testing the Extension

1. **Launch Extension Development Host:**
   - Open the project in VS Code
   - Press `F5` or go to Run > Start Debugging
   - This opens a new VS Code window with your extension loaded

2. **Create test workspace with tasks:**
   ```bash
   # Copy sample tasks to test with
   cp .vscode/sample-tasks.json.example .vscode/tasks.json
   ```

3. **Test functionality:**
   - Open Task Explorer from Activity Bar
   - Verify only workspace-defined tasks appear (no npm scripts)
   - Test running and stopping tasks
   - Check real-time status updates

### Project Structure

```
simple-task-explorer/
├── src/
│   ├── extension.ts     # Main extension entry point
│   ├── taskProvider.ts  # Tree data provider for task list
│   └── taskItem.ts      # Individual task tree items
├── .vscode/
│   ├── launch.json      # Debug configuration
│   ├── tasks.json       # Build tasks
│   └── sample-tasks.json.example  # Sample tasks for testing
├── scripts/
│   └── publish.sh       # Automated publishing script
├── package.json         # Extension manifest
└── tsconfig.json        # TypeScript configuration
```

### Key Implementation Details

- **Task Filtering**: Only shows tasks with `source === 'Workspace'` (from tasks.json)
- **Running Indicator**: Uses spinning loading icon and "running" text
- **Multi-root Support**: Adds folder prefixes when task names collide
- **Real-time Updates**: Listens to VS Code task lifecycle events

## Making Changes

### Code Style

- Use TypeScript for all source files
- Follow existing code patterns and naming conventions
- Use VS Code's built-in formatting (`Shift+Alt+F`)

### Testing Your Changes

1. **Compile and test:**
   ```bash
   npm run compile
   # Press F5 in VS Code to test
   ```

2. **Verify task filtering works correctly:**
   - Only workspace tasks should appear
   - No npm scripts or auto-detected tasks
   - Multi-root workspaces should show folder prefixes

3. **Test edge cases:**
   - Empty task list
   - Running multiple tasks
   - Stopping tasks
   - Workspace changes

### Submitting Changes

1. **Ensure code quality:**
   ```bash
   npm run compile  # Should complete without errors
   npm run package  # Should create valid .vsix
   ```

2. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: your change description"
   ```

3. **Create pull request** with:
   - Clear description of changes
   - Steps to test the changes
   - Screenshots if UI changes

## Publishing to OpenVSX

### Prerequisites

1. **Install publishing tools:**
   ```bash
   npm install -g @vscode/vsce ovsx
   ```

2. **Get OpenVSX Personal Access Token:**
   - Visit [OpenVSX Registry](https://open-vsx.org/)
   - Sign in with GitHub
   - Go to your profile settings
   - Generate a new Access Token with publish permissions

3. **Set up environment:**
   ```bash
   # Copy and edit environment file
   cp .env.example .env
   # Add your token to .env file
   export OVSX_PAT=your_access_token_here
   ```

4. **Update package.json:**
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
./scripts/publish.sh
```

The script automatically:
- ✅ Validates dependencies and environment
- ✅ Checks for uncommitted changes
- ✅ Compiles and packages the extension
- ✅ Publishes to OpenVSX Registry

#### Method 2: Manual Publishing

```bash
# Compile and package
npm run compile
npm run package

# Publish to OpenVSX
ovsx publish simple-task-explorer-*.vsix -p $OVSX_PAT
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

### Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass and extension works correctly
- [ ] Version number is updated in `package.json`
- [ ] All changes are committed to git
- [ ] `publisher` field is set in `package.json`
- [ ] Repository URL is correct in `package.json`
- [ ] Extension has been tested in a clean VS Code environment
- [ ] No sensitive information (tokens, keys) in code

### Version Management

Update the version before publishing:

```bash
# Patch version (0.1.0 -> 0.1.1) - bug fixes
npm version patch

# Minor version (0.1.0 -> 0.2.0) - new features
npm version minor

# Major version (0.1.0 -> 1.0.0) - breaking changes
npm version major
```

### Publishing Troubleshooting

**Common Issues:**

1. **"Publisher not found"**: 
   - Register as a publisher on OpenVSX first
   - Verify publisher name in package.json

2. **"Invalid token"**: 
   - Check your OVSX_PAT environment variable
   - Regenerate token if expired

3. **"Version already exists"**: 
   - Update version in package.json
   - Use `npm version patch/minor/major`

4. **Package validation errors**: 
   - Run `npm run publish:check` to identify issues
   - Check package.json required fields

**Getting Help:**

- Check the [OpenVSX documentation](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- Verify your package with `vsce package --out test.vsix` before publishing
- Use `./scripts/publish.sh --help` for script usage

## Architecture Notes

### Task Provider Implementation

The extension uses VS Code's TreeDataProvider pattern:

- `TaskProvider` - Manages task list and implements TreeDataProvider
- `TaskItem` - Represents individual tasks in the tree
- Real-time updates via VS Code task lifecycle events

### Task Filtering Logic

Only workspace-defined tasks are shown:

```typescript
// Filter to only workspace tasks (from tasks.json)
this.tasks = allTasks.filter(task => task.source === 'Workspace');
```

This excludes npm scripts, extension-contributed tasks, and other auto-detected tasks.

### Multi-root Workspace Support

When task names collide across folders:

```typescript
const folderName = hasNameCollision && task.scope && typeof task.scope !== 'number' 
    ? task.scope.name 
    : undefined;
```

Folder names are prefixed to task labels to avoid confusion.

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Include reproduction steps and VS Code version info