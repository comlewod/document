<?php 
namespace common\components;

use Yii;
use yii\web\Controller;

class CController extends Controller {
	public $tplDir = 'www';			//项目文件名
	public $tpl = '';
	
	public $_tempVal;				//临时变量
	public $_layout_ = '';			//项目的layout名
	public $_layoutData = array();	//传递给给layout的数据 
	public $_tplData = array();		//传递给模板页面的数据
	public $_widget = array();
	public $_scriptPool = '';		//将每个widget的js调用代码连在一起
	
	/*
	 * 设置layout，传入的是项目名
	 */
	public function setLayout($name = ''){
		$this->_layout_ = $name;
	}
	
	/*
	 * 页面SDK
	 */
	public function setTitle($title = ''){
		$this->setData('title', $title);
	}
	public function setDescription($description = ''){
		$this->setData('description', $description);
	}
	public function setKeywords($keywords = ''){
		$this->setData('keywords', $keywords);
	}

	/*
	 * 内容函数
	 */
	public function startBlock($val_name = ''){
		$this->_tempVal = $val_name;
		ob_start();
	}
	public function endBLock(){
		$_buffer = ob_get_clean();	//这里没有输出缓冲区，而是将缓冲内容保存起来
		$this->setData($this->_tempVal, $_buffer);
	}

	public function scriptPoolStart(){
		ob_start();
	}

	public function scriptPoolEnd(){
		$_buffer = ob_get_clean();
		$this->_scriptPool .= $_buffer;
	}

	/*
	 * 替换layout中的js 和 css
	 */
	 public function pageStatic($js_name = '', $css_name = ''){
		 $this->setData('page_js', $js_name);
		 $this->setData('page_css', $css_name);
	 }

	/*
	 * 设置变量数据
	 * $key: 变量名；$value：数值
	 */
	public function setData($key = '', $value = ''){
		if( is_array($key) ){
			//将$key复制为_layoutData
			foreach( $key as $key_1 => $value_1 ){
				$this->_layoutData[$key_1] = $value_1;
			}

		} else if( is_string($key) ){
			$this->_layoutData[$key] = $value;
		}
	}

	/*
	 * 加载widget，
	 * $file_name		widget的名称
	 * $param			传给widget的数组
	 * $tpl				$file_name该组件所在页面的文件夹，比如global、post
	 */
	public function loadWidget($file_name = '', $param = array(), $tpl = null){
		if( empty($tpl) ){
			$tpl = $this->tpl;
			if( empty($tpl) ){
				$tpl = str_replace('Controller', '', lcfirst($this->getClassName($this)));
			}
		}
		$file_name = $tpl . '_' .$file_name;//ex：post_battery

		if( !isset($this->_widget[$file_name]) ){
			$this->_widget[$file_name] = 1;
		}

		extract($param, EXTR_OVERWRITE);

		include(Yii::$app->params['ROOT'] . 'output/widgets/' . $this->tplDir . '_' . $file_name . '.php');
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
		//一般这里都已经将页面内容赋值给$content
		
		//这里将$title、$description等变量置于当前环境中
		extract($this->_layoutData, EXTR_OVERWRITE);
	
		//以layouts为主体，将已经赋值的变量置于layouts中
		if( $this->_layout_ ){
			//$content的值插入layout中
			include(yii::$app->params['ROOT'] . 'output/pages/layouts_' . $this->_layout_ . '.php');
		}
		return ob_get_clean();
	}

	public function yiiApp($key){
		echo Yii::$app->params[$key];
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
