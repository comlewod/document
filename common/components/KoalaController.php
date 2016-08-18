<?php
namespace common\components;

use Yii;

class KoalaController extends CController {
	public function __construct($id, $module=null){
		parent::__construct($id, $module);
		$this->tplDir = 'koala';
	}
}
