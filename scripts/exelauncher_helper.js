/**
 * EXE 运行器辅助脚本 - v86 模拟器配置
 * 提供 DOS 系统镜像和 BIOS 的本地/远程加载
 */

const V86_CONFIG = {
    // v86 WASM 文件路径
    wasmPath: 'https://cdn.jsdelivr.net/npm/v86@1.0.0/build/v86.wasm',
    
    // BIOS 文件
    bios: {
        url: 'https://cdn.jsdelivr.net/npm/v86@1.0.0/bios/seabios.bin',
        size: 131072
    },
    
    // VGA BIOS
    vgaBios: {
        url: 'https://cdn.jsdelivr.net/npm/v86@1.0.0/bios/vgabios.bin',
        size: 32768
    },
    
    // FreeDOS 镜像 - 一个完整的 DOS 系统
    freedos: {
        url: 'https://copy.sh/v86/images/freedos722.img',
        size: 737280
    },
    
    // MS-DOS 6.22 镜像 (备用)
    msdos: {
        url: 'https://copy.sh/v86/images/msdos622.img',
        size: 1474560
    },
    
    // 配置选项
    emulatorOptions: {
        memory_size: 32 * 1024 * 1024,  // 32MB RAM
        vga_memory_size: 2 * 1024 * 1024, // 2MB VRAM
        screen_width: 720,
        screen_height: 400,
        autostart: true,
        disable_keyboard: false,
        disable_mouse: true,
        preserve_mac_from_state_image: true
    }
};

/**
 * 检查 v86 库是否加载成功
 */
function checkV86Library() {
    return typeof V86Starter !== 'undefined';
}

/**
 * 预加载资源
 */
async function preloadV86Resources() {
    const resources = [
        V86_CONFIG.bios,
        V86_CONFIG.vgaBios,
        V86_CONFIG.freedos
    ];
    
    const loaded = [];
    for (const res of resources) {
        try {
            const response = await fetch(res.url, { method: 'HEAD' });
            if (response.ok) {
                loaded.push(res.url);
            }
        } catch (e) {
            console.warn('Failed to preload:', res.url);
        }
    }
    
    return loaded;
}

/**
 * 创建 v86 配置
 */
function createV86Config(canvas, screenContainer) {
    return {
        wasm_path: V86_CONFIG.wasmPath,
        memory_size: V86_CONFIG.emulatorOptions.memory_size,
        vga_memory_size: V86_CONFIG.emulatorOptions.vga_memory_size,
        screen_container: screenContainer,
        bios: V86_CONFIG.bios,
        vga_bios: V86_CONFIG.vgaBios,
        cdrom: V86_CONFIG.freedos,
        autostart: V86_CONFIG.emulatorOptions.autostart,
        disable_keyboard: V86_CONFIG.emulatorOptions.disable_keyboard,
        disable_mouse: V86_CONFIG.emulatorOptions.disable_mouse
    };
}

/**
 * 文件系统操作工具
 */
const V86FS = {
    /**
     * 将文件写入 v86 虚拟磁盘
     */
    writeFile: (emulator, path, data) => {
        if (!emulator || !emulator.fs) {
            throw new Error('Emulator not ready');
        }
        
        // 确保路径使用 DOS 格式
        const dosPath = path.replace(/\//g, '\\');
        
        // 写入文件
        emulator.fs.write_file(dosPath, data);
        return true;
    },
    
    /**
     * 从 v86 虚拟磁盘读取文件
     */
    readFile: (emulator, path) => {
        if (!emulator || !emulator.fs) {
            throw new Error('Emulator not ready');
        }
        
        const dosPath = path.replace(/\//g, '\\');
        return emulator.fs.read_file(dosPath);
    },
    
    /**
     * 列出目录内容
     */
    listDirectory: (emulator, path) => {
        if (!emulator || !emulator.fs) {
            throw new Error('Emulator not ready');
        }
        
        const dosPath = path.replace(/\//g, '\\');
        return emulator.fs.readdir(dosPath);
    }
};

/**
 * 键盘扫描码映射
 */
const KEYBOARD_SCANCODES = {
    // 特殊键
    CTRL_ALT_DEL: [0x1D, 0x38, 0x53, 0xD3, 0xB8, 0x9D],
    ENTER: [0x1C, 0x9C],
    ESC: [0x01, 0x81],
    SPACE: [0x39, 0xB9],
    TAB: [0x0F, 0x8F],
    
    // 功能键
    F1: [0x3B, 0xBB],
    F2: [0x3C, 0xBC],
    F3: [0x3D, 0xBD],
    F4: [0x3E, 0xBE],
    F5: [0x3F, 0xBF],
    
    // 方向键
    UP: [0xE0, 0x48, 0xE0, 0xC8],
    DOWN: [0xE0, 0x50, 0xE0, 0xD0],
    LEFT: [0xE0, 0x4B, 0xE0, 0xCB],
    RIGHT: [0xE0, 0x4D, 0xE0, 0xCD]
};

/**
 * 发送键盘输入到模拟器
 */
function sendKeyboardInput(emulator, text) {
    if (!emulator || !emulator.keyboard_send_text) {
        return false;
    }
    
    emulator.keyboard_send_text(text);
    return true;
}

/**
 * 发送扫描码到模拟器
 */
function sendScancodes(emulator, scancodes) {
    if (!emulator || !emulator.keyboard_send_scancodes) {
        return false;
    }
    
    emulator.keyboard_send_scancodes(scancodes);
    return true;
}

// 导出 API
window.V86_CONFIG = V86_CONFIG;
window.checkV86Library = checkV86Library;
window.preloadV86Resources = preloadV86Resources;
window.createV86Config = createV86Config;
window.V86FS = V86FS;
window.KEYBOARD_SCANCODES = KEYBOARD_SCANCODES;
window.sendKeyboardInput = sendKeyboardInput;
window.sendScancodes = sendScancodes;
