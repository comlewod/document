<?php 
namespace common\components;

use Yii;
use yii\web\Controller;

class CController extends Controller {
	public $tplDir = 'www';		//项目文件名
	public $_tplData = array();	//传递给模板页面的数据

	public function display($file_name = '', $param = array(), $tpl = null){
		if( empty($tpl) ){
			$tpl = $this->tplDir;
			if( empty($tpl) ){
				$tpl = str_replace('Controller', '', lcfirst($this->getClassName($this)));
			}
		}

		$file_name = $tpl . '_' .$file_name;//ex：koala_post

		if( is_array($param) ){
			foreach( $param as $key => $value ){
				$this->_tplData[$key] = $value;
			}
		}

		extract($this->_tplData, EXTR_OVERWRITE); //将变量导入到当前模板中

		//$this->cashed($file_name);

		ob_start();
		ob_implicit_flush(false);
	}
	
	//获得$this的类名，比如IndexController
	private function getClassName($object){
		if( !is_object($object) && !is_string($object) ){
			return false;
		}

		$class = explode('\\', ( is_string($object) ? $object : get_class($object) ));
		return $class[count($class) - 1];
	}
}
