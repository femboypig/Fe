const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Check if git is installed and get its path
function getGitPath() {
    try {
        const isWindows = process.platform === 'win32';
        console.log('Platform:', process.platform);

        // First try which/where command
        try {
            const command = isWindows ? 'where git' : 'which git';
            const wherePath = execSync(command, { encoding: 'utf8' }).split('\n')[0].trim();
            console.log('Git path from which/where command:', wherePath);
            if (fs.existsSync(wherePath)) {
                return wherePath;
            }
        } catch (e) {
            console.log('which/where git failed:', e.message);
        }

        if (isWindows) {
            // Windows-specific paths
            const commonPaths = [
                'C:\\Program Files\\Git\\cmd\\git.exe',
                'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
                process.env.PROGRAMFILES + '\\Git\\cmd\\git.exe',
                process.env['PROGRAMFILES(X86)'] + '\\Git\\cmd\\git.exe',
            ];

            for (const gitPath of commonPaths) {
                console.log('Checking Windows git path:', gitPath);
                if (fs.existsSync(gitPath)) {
                    console.log('Found git at:', gitPath);
                    return gitPath;
                }
            }
        } else {
            // Linux/Unix paths
            const unixPaths = [
                '/usr/bin/git',
                '/usr/local/bin/git',
                '/opt/local/bin/git',
                path.join(os.homedir(), '.local/bin/git')
            ];

            for (const gitPath of unixPaths) {
                console.log('Checking Unix git path:', gitPath);
                if (fs.existsSync(gitPath)) {
                    console.log('Found git at:', gitPath);
                    return gitPath;
                }
            }
        }

        throw new Error('Git executable not found in common locations');
    } catch (error) {
        console.error('Error finding git:', error);
        throw new Error('Could not find Git installation. Please install Git from https://git-scm.com/downloads');
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#ffffff'
    });

    mainWindow.loadFile(path.join(__dirname, 'welcome.html'));
}

// Handle window control events
ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('window-close', () => {
    mainWindow.close();
});

// Handle Git operations
ipcMain.handle('git-clone', async (event, { url, directory }) => {
    try {
        // Get git path first
        const gitPath = getGitPath();
        console.log('Using git from:', gitPath);

        return new Promise((resolve, reject) => {
            const targetDir = directory || path.basename(url, '.git');
            const fullPath = path.join(app.getPath('documents'), 'Z-Projects', targetDir);
            console.log('Target directory:', fullPath);

            // Create projects directory if it doesn't exist
            const projectsDir = path.join(app.getPath('documents'), 'Z-Projects');
            if (!fs.existsSync(projectsDir)) {
                console.log('Creating projects directory:', projectsDir);
                fs.mkdirSync(projectsDir, { recursive: true });
            }

            // Check if directory already exists
            if (fs.existsSync(fullPath)) {
                reject(new Error('Directory already exists'));
                return;
            }

            // Set English language and other env vars
            const env = Object.assign({}, process.env, {
                LANG: 'en_US.UTF-8',
                LC_ALL: 'en_US.UTF-8',
                LC_MESSAGES: 'en_US.UTF-8',
                GIT_TERMINAL_PROMPT: '0'
            });

            console.log('Starting git clone...');
            
            // Use different command format based on platform
            const isWindows = process.platform === 'win32';
            const command = isWindows 
                ? `"${gitPath}" clone "${url}" "${fullPath}"`
                : `${gitPath} clone "${url}" "${fullPath}"`;
                
            console.log('Command:', command);
            
            const gitProcess = exec(command, {
                windowsHide: true,
                env,
                encoding: 'utf8'
            }, (error, stdout, stderr) => {
                if (error) {
                    console.error('Git clone error:', {
                        error: error.message,
                        stdout,
                        stderr,
                        code: error.code
                    });

                    const errorDetails = [
                        `Exit code: ${error.code}`,
                        `Error: ${error.message}`,
                        stdout ? `Output: ${stdout}` : null,
                        stderr ? `Error output: ${stderr}` : null
                    ].filter(Boolean).join('\n');

                    reject(new Error(`Git clone failed:\n${errorDetails}`));
                    return;
                }
                
                console.log('Git clone successful');
                console.log('Stdout:', stdout);
                console.log('Stderr:', stderr);
                
                resolve({ path: fullPath });
            });

            gitProcess.stderr.on('data', (data) => {
                const progress = data.toString();
                console.log('Git progress:', progress);
                mainWindow.webContents.send('clone-progress', progress);
            });

            gitProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('Git output:', output);
                mainWindow.webContents.send('clone-progress', output);
            });

            gitProcess.on('error', (error) => {
                console.error('Process error:', error);
                reject(new Error(`Process error: ${error.message}`));
            });
        });
    } catch (error) {
        console.error('Top-level error:', error);
        throw error;
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 