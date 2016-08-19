<?php 
namespace common\components;

use Yii;
use yii\web\Controller;

class CController extends Controller {
	public $tplDir = 'www';			//项目文件名
	public $tpl = '';
	
	public $_layout_ = '';			//项目的layout名
	public $_layoutData = array();	//传递他给layout的数据 
	public $_tplData = array();		//传递给模板页面的数据
	public $_widget = array();
	
	/*
	 * 设置layout，传入的是项目名
	 */
	public function setLayout($name = ''){
		$this->_layout_ = $name;
	}

	/*
	 * 加载widget
	 */
	public function loadWidget($file_name = '', $param = array(), $tpl = null){
		if( empty($tpl) ){
			$tpl = $this->tpl;
			if( empty($tpl) ){
				$tpl = str_replace('Controller', '', lcfirst($this->getClassName($this)));
			}
		}
		$file_name = $tpl . '_' .$file_name;//ex：koala_post

		if( !isset($this->_widget[$file_name]) ){
			$this->_widget[$file_name] = 1;
		}

		extract($param, EXTR_OVERWRITE);

		include(Yii::$app->params['ROOT'] . 'output/widgets' . $this->tplDir . '_' . $file_name . '.php');
	}

	public function display($file_name = '', $param = array(), $tpl = null){
		if( empty($tpl) ){
			$tpl = $this->tpl;
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

		extract($this->_tplData, EXTR_OVERWRITE); //将_tplData数组里的变量释放到当前模板中

		//$this->cashed($file_name);

		ob_start();
		ob_implicit_flush(false);// 关闭显式刷新，为true的话则每次有输出都会刷新缓冲区
		include_once(Yii::$app->params['ROOT'] . 'output/pages/' . $this->tplDir . '_' .$file_name . '.php');

		extract($this->_layoutData, EXTR_OVERWRITE);

		if( $this->_layout_ ){
			include(yii::$app->params['ROOT'] . 'output/pages/layouts_' . $this->_layout_ . '.php');
		}
		return ob_get_clean();
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
