//农历获取实现 By @stxttkx
async function getLunar()
{
    var lunarDisplay = document.getElementById('lunar');
    try{
        const response = await fetch('https://api.lolimi.cn/API/rl/api');
        if (!response.ok){
            throw new Error('网络不给力');
        }
        const jsonContent = await response.json();
        if(jsonContent.code !== 1){
            throw new Error(`服务器异常，错误码: ${jsonContent.code}`);
        }
        const lunarContent = jsonContent?.data?.lunar
        lunarDisplay.textContent = lunarContent;
    }
    catch(error){
        lunarDisplay.textContent = error;
    }
}

getLunar();//启动模块