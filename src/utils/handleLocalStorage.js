//保存数据
export function saveToLocal(id, item, key, value) {
    //id-商家的id，key-不同的属性名，value-属性名的值
	let seller = window.localStorage.__seller__; //专用字段__seller__
	if (!seller) {
	  //刚开始的时候还没有seller
		seller = {};
		seller[id] = {};
	} else {
	  //如果window.localStorage.__seller__已经有了
    //因为读取的值是字符串的json，所以需要解析成json形式
		seller = JSON.parse(seller);
		if (!seller[id]) {
		  //需要判断seller中是否有属性id，没有的话需要给他进行定义
			seller[id] = {};
		}
	}
	seller[id][key] = value;  //设置不同id下的key的值
  //由于存储只能是字符串的值，需要将JSON转化成字符串的json形式
  //存储的localStorage的变量名是：_seller_
	window.localStorage.__seller__ = JSON.stringify(seller);
};
//读取数据
export function loadFromLocal(id, item, key, def) {
  //id-商家的id，key-不同的属性名,def-default默认值
	let seller = window.localStorage.__seller__;
	if (!seller) {
	  //如果该变量还没有存储在localStorage中，那么需要返回一个默认值
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
    }
    if (!seller[item]) {
		return def;
	}
	let ret = seller[item][key];
	return ret || def;
};