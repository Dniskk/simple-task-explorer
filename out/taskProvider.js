"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProvider = void 0;
const vscode = __importStar(require("vscode"));
const taskItem_1 = require("./taskItem");
class TaskProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    tasks = [];
    runningTasks = new Set();
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
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Root level - return all tasks
            await this.loadTasks();
            return this.createTaskItems();
        }
        return [];
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    async loadTasks() {
        try {
            this.tasks = await vscode.tasks.fetchTasks();
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch tasks: ${error}`);
            this.tasks = [];
        }
    }
    createTaskItems() {
        const taskItems = [];
        const taskNameCounts = new Map();
        // Count task names to detect collisions
        for (const task of this.tasks) {
            const count = taskNameCounts.get(task.name) || 0;
            taskNameCounts.set(task.name, count + 1);
        }
        for (const task of this.tasks) {
            const hasNameCollision = taskNameCounts.get(task.name) > 1;
            const folderName = hasNameCollision && task.scope && typeof task.scope !== 'number'
                ? task.scope.name
                : undefined;
            const isRunning = this.runningTasks.has(this.getTaskId(task));
            taskItems.push(new taskItem_1.TaskItem(task, isRunning, folderName));
        }
        // Sort by name for consistent ordering
        return taskItems.sort((a, b) => a.label.toString().localeCompare(b.label.toString()));
    }
    getTaskId(task) {
        const scope = task.scope && typeof task.scope !== 'number' ? task.scope.name : 'global';
        return `${scope}:${task.name}:${task.definition.type}`;
    }
    async runTask(taskItem) {
        try {
            await vscode.tasks.executeTask(taskItem.task);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to run task "${taskItem.task.name}": ${error}`);
        }
    }
    async stopTask(taskItem) {
        try {
            const executions = vscode.tasks.taskExecutions;
            const matchingExecutions = executions.filter(execution => this.getTaskId(execution.task) === this.getTaskId(taskItem.task));
            if (matchingExecutions.length === 0) {
                vscode.window.showWarningMessage(`No running execution found for task "${taskItem.task.name}"`);
                return;
            }
            const config = vscode.workspace.getConfiguration('simpleTaskExplorer');
            const stopAll = config.get('stopAllMatchingExecutions', true);
            if (stopAll) {
                // Stop all matching executions
                for (const execution of matchingExecutions) {
                    execution.terminate();
                }
            }
            else {
                // Stop only the most recent execution
                const mostRecent = matchingExecutions[matchingExecutions.length - 1];
                mostRecent.terminate();
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to stop task "${taskItem.task.name}": ${error}`);
        }
    }
}
exports.TaskProvider = TaskProvider;
//# sourceMappingURL=taskProvider.js.map