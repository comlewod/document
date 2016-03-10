<?php 
namespace common\components;

use Yii;
use yii\web\Controller;

class CController extends Controller {
	public $tplDir = 'www';
	public function display(){
		var_dump($this->tplDir);die;
	}
}
