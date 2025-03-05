document.addEventListener('DOMContentLoaded', () => {
    // Window control buttons
    const closeButton = document.querySelector('.control.close');
    const minimizeButton = document.querySelector('.control.minimize');
    const maximizeButton = document.querySelector('.control.maximize');
    
    closeButton.addEventListener('click', () => {
        windowControls.close();
    });
    
    minimizeButton.addEventListener('click', () => {
        windowControls.minimize();
    });
    
    maximizeButton.addEventListener('click', () => {
        windowControls.maximize();
    });

    // File tree toggle
    const fileTreeButton = document.querySelector('.file-tree-toggle');
    const sidebar = document.getElementById('sidebar');
    let isFileTreeVisible = true;

    // Set initial state
    fileTreeButton.classList.add('active');

    fileTreeButton.addEventListener('click', () => {
        isFileTreeVisible = !isFileTreeVisible;
        fileTreeButton.classList.toggle('active', isFileTreeVisible);
        sidebar.classList.toggle('hidden', !isFileTreeVisible);
    });

    // Sidebar resize functionality
    const resizer = document.getElementById('resizer');
    let isResizing = false;
    let lastDownX = 0;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastDownX = e.clientX;
        resizer.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const delta = e.clientX - lastDownX;
        lastDownX = e.clientX;

        const sidebarWidth = sidebar.offsetWidth + delta;
        if (sidebarWidth >= 200 && sidebarWidth <= 600) {
            sidebar.style.width = `${sidebarWidth}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        resizer.classList.remove('resizing');
    });
}); 


