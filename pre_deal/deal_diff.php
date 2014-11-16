<html>
    <head>
        <title>数据预处理</title>
        <meta charset="UTF-8">
    </head>
</html>
<?php

//该方法遍历数组a更新节点i的子节点的错误信息，若节点i出错，其子节点error标记为2
function update(&$a, $i) {
    $arr = $a[$i]['children'];
    for($j=0; $j<count($arr); $j++) {
        if($arr[$j]['error'] == 0) {
            $arr[$j]['error'] = 2;
//			echo "<script>alert('".$arr[$j]['name']."')</script>";
            update($arr, $j);		//递归更新其节点j的子节点的错误信息
        }
    }
}

require_once('json.php');

$content1 = file_get_contents('../source/devo.txt');
$content2 = file_get_contents('../source/devr.txt');

$array1 = explode("\n\n", $content1);
$array2 = explode("\n\n", $content2);

for($k=0; $k<100; $k++)
{
    $words1 = array();
    $words2 = array();
    $a1 = array();
    $a2 = array();
    $lines1 = explode("\n", $array1[$k]);
    $lines2 = explode("\n", $array2[$k]); 	//lines保存每一句话的四列数据
    $j=0;	//与版本2不同，版本2第一段与其他段开始词组相差一，此版本都相同
    $flag = 0;
    $sentence='';
    for(; $j<count($lines1); $j++) {
        $res1=explode("\t",$lines1[$j]);
        array_push($words1, $res1);
        $res2=explode("\t",$lines2[$j]);
        array_push($words2, $res2);		//words数组保存一句话每一个单词的name，词性等
    }
    for($i = 0; $i < count($words1); $i++) {
        $a1[$i]['children']=array();
        $a2[$i]['children']=array();
    }
    for($i = 0; $i < count($words1); $i++) {
        $sentence .= $words1[$i][0].' ';	//sentence是一个完整句子
        $a1[$i]['name']=$words1[$i][0].'';
        $a2[$i]['name']=$words2[$i][0].'';
        $a1[$i]['order']=$i+1;
        $a2[$i]['order']=$i+1;  //该节点在句子中的位置序号order
        $a1[$i]['error'] = 0;
        $a2[$i]['error'] = 0;
        $j1=intval($words1[$i][2],10);  //父节点的序号order
        $j2=intval($words2[$i][2],10);
        if($j1==-1){
            $root1=&$a1[$i];					//如果j1为-1，则说明是根
        } else {
            $a1[$j1]['children'][]=&$a1[$i];	//如果j1不为-1，说明该节点的父节点是j1
        }
        if($j2==-1){
            $root2=&$a2[$i];
        } else {
            $a2[$j2]['children'][]=&$a2[$i];
        }
        if($j1 != $j2) {
            echo '不相同'.'<br>';
            $a1[$i]['error'] = 1;
            $a2[$i]['error'] = 1;
        }
    }
    for($i = 0; $i < count($words1); $i++) {	//再次遍历所有单词，递归更新错误信息，若一节点出错则其所有子节点error=2
        if($a1[$i]['error'] == 1) {
            update($a1, $i);
        }
        if($a2[$i]['error'] == 1) {
            update($a2, $i);
        }
    }
    $root1['sentence'] = $sentence;
    $root2['sentence'] = $sentence;

    $fp1 = fopen('../dst/devo_diff'.($k+1).'.json', "w");//文件被清空后再写入
    $fp2 = fopen('../dst/devr_diff'.($k+1).'.json', "w");//文件被清空后再写入
    $flag=fwrite($fp1,JSON($root1));
    $flag=fwrite($fp2,JSON($root2));
    if(!$flag)
    {
        echo "写入文件失败<br>";
        break;
    } else {
        echo JSON($root2).'<br><br>';
    }

//    echo JSON($root1).'<br><br>';
//    echo JSON($root2).'<br><br>';
    $_POST['upload'] = 'upload';
//    echo '<script>window.location="index.php";</script>';
}