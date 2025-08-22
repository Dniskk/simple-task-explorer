import * as vscode from 'vscode';
export declare class TaskItem extends vscode.TreeItem {
    readonly task: vscode.Task;
    readonly isRunning: boolean;
    readonly folderName?: string | undefined;
    constructor(task: vscode.Task, isRunning?: boolean, folderName?: string | undefined);
    private getTooltip;
    private getDescription;
}
//# sourceMappingURL=taskItem.d.ts.map