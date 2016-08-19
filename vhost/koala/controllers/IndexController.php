<?php
namespace koala\controllers;

use common\components\KoalaController;

class IndexController extends KoalaController{
	public function actionIndex(){
		return $this->display('index', array(
			'str' => 'haha'
		));
	}
}
?>
