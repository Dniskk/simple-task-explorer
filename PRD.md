# PRD: Simple Task Explorer (VS Code Extension)

## 1) Summary
A minimal VS Code sidebar view that lists all available Tasks (`tasks.json` and detected). Users can **run** or **stop** tasks directly. No extra features. Publish on **OpenVSX**.

## 2) Goals / Non-Goals
- **Goals**
  - Show tasks in a sidebar list.
  - Run a task (equivalent to built-in “Run Task” behavior).
  - Stop a running task.
  - Refresh the list.
  - Publish to OpenVSX.
- **Non-Goals**
  - No custom editors, dashboards, grouping, pinning, favorites, history, status bars, auto-detect tweaks, or advanced configuration.

## 3) User Stories
- As a user, I see all tasks in a simple list in the sidebar.
- I click ▶ to run a task; it behaves like running it via Command Palette > “Run Task”.
- I click ⏹ on a running task to stop it.
- I click 🔄 to refresh tasks.

## 4) UX / UI
- **View Container**: “Task Explorer” in Activity Bar > “Explorer” style container.
- **View**: Single list `Simple Task Explorer`.
  - Row: `$(terminal)` icon + task label.
  - Actions per row: `Run (▶)`, `Stop (⏹, only if running)`.
- **Header actions**: `Refresh (🔄)`.
- **No search, no grouping, no inline editing.**

## 5) Functional Requirements
- **List Tasks**
  - Use `vscode.tasks.fetchTasks()` on activation and on refresh.
  - Include both configured (`tasks.json`) and contributed/detected tasks.
  - For each item, store reference to its `vscode.Task`.
- **Run Task**
  - Triggering run executes the selected `vscode.Task` via `vscode.tasks.executeTask(task)`.
  - Must mirror built-in behavior (problem matchers, terminals, etc. handled by VS Code).
- **Stop Task**
  - Map running items using `vscode.tasks.taskExecutions`.
  - If a matching `TaskExecution` exists, call `terminate()`.
  - If multiple executions of the same task exist, terminate all or the most recent (config below).
- **State Updates**
  - Listen to `vscode.tasks.onDidStartTask` / `onDidEndTask` to update running indicators.
  - Refresh view on lifecycle events and on explicit refresh.
- **Multi-root Workspaces**
  - Display tasks from all folders; prefix label with folder name only if name collision.
- **Errors**
  - Show `vscode.window.showErrorMessage` on failures (fetch, run, stop).
- **Performance**
  - Initial load under 300ms on typical projects (defer heavy work; render iteratively if needed).

## 6) Commands & Contribution Points
- **Commands**
  - `simpleTaskExplorer.refresh` — reload tasks.
  - `simpleTaskExplorer.runTask` — run a specific task (context).
  - `simpleTaskExplorer.stopTask` — stop a specific running task (context).
  - `simpleTaskExplorer.openView` — reveal the view.
- **package.json (key points)**
  - `contributes.viewsContainers.activitybar`: add “Task Explorer”.
  - `contributes.views`: add `simpleTaskExplorer.view`.
  - `contributes.menus.view/item/context`: add Run/Stop actions.
  - `activationEvents`: `onView:simpleTaskExplorer.view`, `onCommand:*`.
  - `engines.vscode`: set a recent stable API (e.g., `^1.90.0` or newer).
  - `categories`: `Other`.
  - `extensionKind`: `["ui"]`.

## 7) Configuration (Minimal)
- `simpleTaskExplorer.stopAllMatchingExecutions` (boolean, default `true`): when stopping a task, terminate all executions with the same definition. If `false`, stop only the most recent.

## 8) Telemetry & Data
- No telemetry. No external services.

## 9) Accessibility & i18n
- Provide aria labels for list, items, and buttons.
- Use VS Code theme icons only; no custom colors.

## 10) Publishing (OpenVSX)
- Ensure `publisher`, `name`, `version`, `license`, `repository` in `package.json`.
- Build using standard vsce packaging.
- Publish via `ovsx publish` (token-based), same `.vsix`.

## 11) Acceptance Criteria
- Sidebar view appears as “Task Explorer”.
- All tasks from `vscode.tasks.fetchTasks()` are listed after activation and on refresh.
- Clicking ▶ runs the chosen task (identical effect to Command Palette > “Run Task”).
- Running tasks are indicated (e.g., subtle “running” badge or enabled ⏹).
- Clicking ⏹ terminates the corresponding execution(s).
- Works in single and multi-root workspaces.
- No extra features beyond this PRD.

## 12) Technical Notes (Implementation Hints)
- **Tree/Data**
  - Use `TreeDataProvider` (flat list).
  - `TreeItem.label` = `task.name` (prefix with folder on collision).
  - `TreeItem.contextValue` to toggle menus (e.g., `taskRunning` vs `taskIdle`).
- **Run/Stop Mapping**
  - Maintain `Map<string, Task[]>` keyed by a stable id (folder + name + definition type).
  - For executions, match via `execution.task` (compare by definition, source, name).
- **Events**
  - Register listeners on activation; dispose on deactivate.

## 13) Milestone v0.1.0 (MVP)
- List, Run, Stop, Refresh, OpenVSX publish readiness.
- Basic a11y labels and error messages.
- No settings UI beyond the single boolean config.
