import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

// Read desktop.html
const desktopHtml = fs.readFileSync('desktop.html', 'utf8');
const $ = cheerio.load(desktopHtml);

// Create apps/windows directory if it doesn't exist
const windowsDir = path.join('apps', 'windows');
if (!fs.existsSync(windowsDir)) {
    fs.mkdirSync(windowsDir, { recursive: true });
}

// List of app names to extract
const appNames = [
    'setting',
    'explorer',
    'calc',
    'about',
    'notepad',
    'terminal',
    'edge',
    'camera',
    'pythonEditor',
    'run',
    'whiteboard',
    'defender',
    'taskmgr',
    'msstore',
    'copilot',
    'recognition'
];

// Extract each app window
for (const appName of appNames) {
    const windowElement = $(`.window.${appName}`);
    if (windowElement.length > 0) {
        // Get the HTML of the window element
        const windowHtml = windowElement.toString();
        
        // Write to separate file
        const filePath = path.join(windowsDir, `${appName}.html`);
        fs.writeFileSync(filePath, windowHtml);
        console.log(`Extracted ${appName} window to ${filePath}`);
        
        // Remove the window from desktop.html
        windowElement.remove();
    } else {
        console.log(`Warning: Could not find window for ${appName}`);
    }
}

// Write the modified desktop.html back
fs.writeFileSync('desktop.html', $.html()); 