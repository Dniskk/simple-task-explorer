import * as vscode from 'vscode';

export class TaskItem extends vscode.TreeItem {
    constructor(
        public readonly task: vscode.Task,
        public readonly isRunning: boolean = false,
        public readonly folderName?: string
    ) {
        const label = folderName ? `${folderName}: ${task.name}` : task.name;
        super(label, vscode.TreeItemCollapsibleState.None);
        
        this.tooltip = this.getTooltip();
        this.description = this.getDescription();
        this.contextValue = isRunning ? 'taskRunning' : 'taskIdle';
        this.iconPath = isRunning 
            ? new vscode.ThemeIcon('loading~spin') 
            : new vscode.ThemeIcon('terminal');
    }

    private getTooltip(): string {
        const baseTooltip = `${this.task.name}\nType: ${this.task.definition.type}`;
        if (this.task.detail) {
            return `${baseTooltip}\nDetail: ${this.task.detail}`;
        }
        return baseTooltip;
    }

    private getDescription(): string | undefined {
        if (this.isRunning) {
            return 'running';
        }
        return undefined;
    }
}