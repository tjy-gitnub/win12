//农历获取实现 By @stxttkx
// 由 lingbopro 改良

let lunarCache = null;
async function getLunar() {
    let lunarDisplay = document.getElementById('lunar');
    if (!lunarCache) {
        try {
            const response = await fetch('https://api.lolimi.cn/API/rl/api');
            if (!response.ok) {
                // 你是怎么想出来往开发控制台打印这种东西的。。。
                // throw new Error('网络不给力');
                throw new Error('HTTP 状态码不符合预期: ' + response.status);
            }
            const jsonContent = await response.json();
            if (jsonContent.code !== 1) {
                throw new Error(`服务器异常，错误码: ${jsonContent.code}`);
            }
            if (typeof jsonContent?.data?.lunar !== 'string') {
                throw new Error('服务器返回数据格式异常');
            }

            lunarCache = jsonContent;
        } catch (error) {
            lunarDisplay.textContent = '';
            console.error('获取农历信息失败: ', error);
        }
    }

    if (lunarCache?.data?.lunar) {
        const lunarContent = lunarCache.data.lunar;
        lunarDisplay.textContent = lunarContent;
    }
}
