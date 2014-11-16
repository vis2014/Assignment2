<?php
$sid;
if ($_GET["sid"]) {
    $sid = $_GET["sid"];
}
$file1 = 'dst/devo_diff'.$sid.'.json';
$file2 = 'dst/devr_diff'.$sid.'.json';
$sentence1 = file_get_contents($file1);
$sentence2 = file_get_contents($file2);
echo $sentence1."#".$sentence2;

//class Helper
//{
//    public $s;
//
//    public $sid = 1;
//
//    function __construct()
//    {
//        $this->s = new SaeStorage();
//    }
//
//    public function now()
//    {
//        return $this->getS();
//    }
//
//    public function next()
//    {
////                $this->sid = $id + 1;
//        $this->sid++;
//        return $this->getS();
//    }
//
//    public function prev()
//    {
//        if($this->sid > 1) {
//            $id = $this->sid;
//            $this->sid = $id - 1;
//        }
//        return $this->getS();
//    }
//
//    public function getS()
//    {
//        $file = 'devr_diff'.$this->sid.'.json';
//        $sentence = $this->s->read('files', $file);
//        return $sentence;
//    }
//}

//        $type = $_GET['type'];
//        $sid = $_GET['sid'];
//        if(strcmp($type,'devo')==0){
//            $file = 'devo_diff'.$sid.'.json';
//        } elseif(strcmp($type,'devr')==0){
//            $file = 'devr_diff'.$sid.'.json';
//        }