import * as vscode from 'vscode';
import { TaskProvider } from './taskProvider';
import { TaskItem } from './taskItem';

export function activate(context: vscode.ExtensionContext) {
    const taskProvider = new TaskProvider();
    const treeView = vscode.window.createTreeView('simpleTaskExplorer.view', {
        treeDataProvider: taskProvider,
        showCollapseAll: false
    });

    // Register tree view
    context.subscriptions.push(treeView);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('simpleTaskExplorer.refresh', () => {
            taskProvider.refresh();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('simpleTaskExplorer.runTask', async (taskItem: TaskItem) => {
            if (taskItem && taskItem.task) {
                await taskProvider.runTask(taskItem);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('simpleTaskExplorer.stopTask', async (taskItem: TaskItem) => {
            if (taskItem && taskItem.task) {
                await taskProvider.stopTask(taskItem);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('simpleTaskExplorer.openView', () => {
            treeView.reveal(undefined, { focus: true, select: false, expand: false });
        })
    );

    // Set accessible label for the tree view
    treeView.title = 'Simple Task Explorer';
    treeView.description = 'List of all available VS Code tasks';
}