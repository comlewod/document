<?php
namespace common\components;

use Yii;

class TestController extends CController {
	public function __construct($id, $module=null){
		parent::__construct($id, $module);
		$this->tplDir = 'test';
	}
}
