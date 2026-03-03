export class DebuggerService {
    constructor() {
        this.status = 'running';
        this.listeners = [];
    }

    start() {
        this.status = 'running';
        // TODO: 后续接入 Mojo 接口卡槽，连接真实的调试器后端
        this.notifyListeners();
        return {
            response: 'Debugger started.',
            responseClass: 'success'
        };
    }

    stop() {
        this.status = 'stopped';
        // TODO: 后续接入 Mojo 接口卡槽，断开与调试器后端的连接
        this.notifyListeners();
        return {
            response: 'Debugger stopped.',
            responseClass: 'gray'
        };
    }

    getStatus() {
        return this.status;
    }

    getStatusText() {
        return this.status === 'running' ? 'Running' : 'Stopped';
    }

    isRunning() {
        return this.status === 'running';
    }

    executeCommand(cmd) {
        const cmdLower = cmd.toLowerCase();
        
        switch (cmdLower) {
            case 'start debugger':
                return this.start();
            case 'stop debugger':
                return this.stop();
            case 'status debugger':
                return {
                    response: `Debugger status: ${this.status}`,
                    responseClass: this.status === 'running' ? 'success' : 'info'
                };
            case 'clear':
                return {
                    response: '',
                    responseClass: 'clear'
                };
            case 'help':
                return {
                    response: 'Available commands:\n  start debugger   - Start the debugger\n  stop debugger    - Stop the debugger\n  status debugger  - Show debugger status\n  clear            - Clear the terminal screen\n  help             - Show this help message',
                    responseClass: 'info'
                };
            default:
                return {
                    response: `zsh: command not found: ${cmd}`,
                    responseClass: ''
                };
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            callback(this.status);
        });
    }
}

export const debuggerService = new DebuggerService();
