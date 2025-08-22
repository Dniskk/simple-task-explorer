import * as vscode from 'vscode';
import { TaskItem } from './taskItem';

export class TaskProvider implements vscode.TreeDataProvider<TaskItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TaskItem | undefined | null | void> = new vscode.EventEmitter<TaskItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TaskItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private tasks: vscode.Task[] = [];
    private runningTasks = new Set<string>();

    constructor() {
        // Listen to task lifecycle events
        vscode.tasks.onDidStartTask(e => {
            this.runningTasks.add(this.getTaskId(e.execution.task));
            this.refresh();
        });

        vscode.tasks.onDidEndTask(e => {
            this.runningTasks.delete(this.getTaskId(e.execution.task));
            this.refresh();
        });
    }

    getTreeItem(element: TaskItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TaskItem): Promise<TaskItem[]> {
        if (!element) {
            // Root level - return all tasks
            await this.loadTasks();
            return this.createTaskItems();
        }
        return [];
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private async loadTasks(): Promise<void> {
        try {
            const allTasks = await vscode.tasks.fetchTasks();
            // Filter to only show VS Code defined tasks (from tasks.json or .code-workspace)
            // Tasks from workspace configuration typically have source === 'Workspace'
            this.tasks = allTasks.filter(task => {
                // Only include tasks that are explicitly defined in workspace configuration
                return task.source === 'Workspace';
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch tasks: ${error}`);
            this.tasks = [];
        }
    }

    private createTaskItems(): TaskItem[] {
        const taskItems: TaskItem[] = [];
        const taskNameCounts = new Map<string, number>();
        
        // Count task names to detect collisions
        for (const task of this.tasks) {
            const count = taskNameCounts.get(task.name) || 0;
            taskNameCounts.set(task.name, count + 1);
        }

        for (const task of this.tasks) {
            const hasNameCollision = taskNameCounts.get(task.name)! > 1;
            const folderName = hasNameCollision && task.scope && typeof task.scope !== 'number' 
                ? task.scope.name 
                : undefined;
            
            const isRunning = this.runningTasks.has(this.getTaskId(task));
            taskItems.push(new TaskItem(task, isRunning, folderName));
        }

        // Sort by name for consistent ordering
        return taskItems.sort((a, b) => a.label!.toString().localeCompare(b.label!.toString()));
    }

    private getTaskId(task: vscode.Task): string {
        const scope = task.scope && typeof task.scope !== 'number' ? task.scope.name : 'global';
        return `${scope}:${task.name}:${task.definition.type}`;
    }

    async runTask(taskItem: TaskItem): Promise<void> {
        try {
            await vscode.tasks.executeTask(taskItem.task);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to run task "${taskItem.task.name}": ${error}`);
        }
    }

    async stopTask(taskItem: TaskItem): Promise<void> {
        try {
            const executions = vscode.tasks.taskExecutions;
            const matchingExecutions = executions.filter(execution => 
                this.getTaskId(execution.task) === this.getTaskId(taskItem.task)
            );

            if (matchingExecutions.length === 0) {
                vscode.window.showWarningMessage(`No running execution found for task "${taskItem.task.name}"`);
                return;
            }

            const config = vscode.workspace.getConfiguration('simpleTaskExplorer');
            const stopAll = config.get<boolean>('stopAllMatchingExecutions', true);

            if (stopAll) {
                // Stop all matching executions
                for (const execution of matchingExecutions) {
                    execution.terminate();
                }
            } else {
                // Stop only the most recent execution
                const mostRecent = matchingExecutions[matchingExecutions.length - 1];
                mostRecent.terminate();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to stop task "${taskItem.task.name}": ${error}`);
        }
    }
}