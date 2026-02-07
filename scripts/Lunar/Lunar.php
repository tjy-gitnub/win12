<?php

header(header: 'Content-Type: text/plain; charset=utf-8');

require 'Lunar-metadata.php';

use com\nlf\calendar\Lunar;

// 获取当前农历日期
$lunar = Lunar::fromDate(date: new DateTime());

//输出
$data = "农历" ;
$data = $data .$lunar->getYearInGanZhi() . "年" ;
$data = $data . $lunar->getMonthInChinese() . "月" ;
$data = $data . $lunar->getDayInChinese() . "日";

return $data ;

?>