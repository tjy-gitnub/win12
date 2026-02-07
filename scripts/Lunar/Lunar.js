var dataContent = document.getElementById('lunar')
fetch('Lunar.php')
.then(response => {
    if (!response.ok) {
        throw new Error('获取农历日期时出错:网络响应不正常');
    }
    return response.text();
})
.then(data => {
    throw new Error(data);
})
.catch(error => {
    dataContent.textContent = error;
});