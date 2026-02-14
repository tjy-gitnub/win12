var dataContent = document.getElementById('lunar')
fetch('https://api.lolimi.cn/API/rl/api')
.then(response => {
    if (!response.ok) {
        throw new Error('获取农历日期时出错:网络异常');
    }
    return response.text();
})

.then(code => {
    if (!code) {
        throw new Error('农历服务器异常，请稍后再试')
    }
})
.then(data => {
    throw new Error(data.lunar);
})
.catch(error => {
    dataContent.textContent = error;
});