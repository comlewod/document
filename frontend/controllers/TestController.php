<?php
namespace frontend\controllers;

use yii\web\Controller;

class TestController extends Controller {
	public function actionIndex($id=0){
		echo $id;
	}
}
?>
