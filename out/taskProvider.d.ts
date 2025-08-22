import * as vscode from 'vscode';
import { TaskItem } from './taskItem';
export declare class TaskProvider implements vscode.TreeDataProvider<TaskItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<TaskItem | undefined | null | void>;
    private tasks;
    private runningTasks;
    constructor();
    getTreeItem(element: TaskItem): vscode.TreeItem;
    getChildren(element?: TaskItem): Promise<TaskItem[]>;
    refresh(): void;
    private loadTasks;
    private createTaskItems;
    private getTaskId;
    runTask(taskItem: TaskItem): Promise<void>;
    stopTask(taskItem: TaskItem): Promise<void>;
}
//# sourceMappingURL=taskProvider.d.ts.map