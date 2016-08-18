<?php
namespace koala\controllers;

use common\components\KoalaController;

class IndexController extends KoalaController{
	public function actionIndex(){
		$this->display('index', array(
			'str' => 'haha'
		));
	}
}
?>
