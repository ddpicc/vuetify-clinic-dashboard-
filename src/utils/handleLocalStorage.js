//保存数据的格式
// localStorage.id.cachedOrder
// localStorage.id.monthIncome
export function saveToLocal(id, key, value) {
    //id-商家的id，key-不同的属性名，value-属性名的值
	let clinicUser = window.localStorage.__clinicUser__; //专用字段__clinicUser__
	if (!clinicUser) {
	  //刚开始的时候还没有clinicUser
	  clinicUser = {};
	  clinicUser[id] = {};
	} else {
	  //如果window.localStorage.__clinicUser__已经有了
    //因为读取的值是字符串的json，所以需要解析成json形式
	clinicUser = JSON.parse(clinicUser);
		if (!clinicUser[id]) {
		  //需要判断seller中是否有属性id，没有的话需要给他进行定义
		  clinicUser[id] = {};
		}
	}
	clinicUser[id][key] = value;  //设置不同id下的key的值
  //由于存储只能是字符串的值，需要将JSON转化成字符串的json形式
  //存储的localStorage的变量名是：_seller_
	window.localStorage.__clinicUser__ = JSON.stringify(clinicUser);
};
//读取数据
export function loadFromLocal(id, key, def) {
  //id-商家的id，key-不同的属性名,def-default默认值
	let clinicUser = window.localStorage.__clinicUser__;
	if (!clinicUser) {
	  //如果该变量还没有存储在localStorage中，那么需要返回一个默认值
		return def;
	}
	clinicUser = JSON.parse(clinicUser)[id];
	if (!clinicUser) {
		return def;
    }
	let ret = clinicUser[key];
	
	return ret;
}