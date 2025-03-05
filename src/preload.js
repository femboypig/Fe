const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'windowControls',
    {
        minimize: () => ipcRenderer.send('window-minimize'),
        maximize: () => ipcRenderer.send('window-maximize'),
        close: () => ipcRenderer.send('window-close')
    }
);

// Expose Git functionality
contextBridge.exposeInMainWorld(
    'git',
    {
        cloneRepository: (url, directory) => ipcRenderer.invoke('git-clone', { url, directory }),
        getCloneProgress: (callback) => ipcRenderer.on('clone-progress', callback)
    }
); 