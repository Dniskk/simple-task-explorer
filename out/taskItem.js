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
exports.TaskItem = void 0;
const vscode = __importStar(require("vscode"));
class TaskItem extends vscode.TreeItem {
    task;
    isRunning;
    folderName;
    constructor(task, isRunning = false, folderName) {
        const label = folderName ? `${folderName}: ${task.name}` : task.name;
        super(label, vscode.TreeItemCollapsibleState.None);
        this.task = task;
        this.isRunning = isRunning;
        this.folderName = folderName;
        this.tooltip = this.getTooltip();
        this.description = this.getDescription();
        this.contextValue = isRunning ? 'taskRunning' : 'taskIdle';
        this.iconPath = new vscode.ThemeIcon('terminal');
    }
    getTooltip() {
        const baseTooltip = `${this.task.name}\nType: ${this.task.definition.type}`;
        if (this.task.detail) {
            return `${baseTooltip}\nDetail: ${this.task.detail}`;
        }
        return baseTooltip;
    }
    getDescription() {
        if (this.isRunning) {
            return '$(play-circle) running';
        }
        return undefined;
    }
}
exports.TaskItem = TaskItem;
//# sourceMappingURL=taskItem.js.map