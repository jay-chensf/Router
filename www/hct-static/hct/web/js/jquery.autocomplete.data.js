/*jslint  browser: true, white: true, plusplus: true */
/*global $: true */
/* info
 * n - 功能名称
 * s - 简单功能被描述
 * a - 动作 id
 * value - 搜索关键词
 * 
 * */

$(function () {
var autosearch = [

];
  
// Initialize autocomplete with local lookup:
$('#autocomplete').click(function(){$(this).val("");})
$('#autocomplete').autocomplete({
	lookup: autosearch,
	suggestionlimit: 7,
	noCache: true,
    onSelect: function (suggestion) {
    	open_windows(suggestion.a,suggestion.p);
    },
	formatResult: function (suggestion, currentValue) {
		var info_html = "";
		// 高亮
		var show_suggestion_s = high_light(suggestion.s,currentValue);
		var show_suggestion_n = high_light(suggestion.n,currentValue);
		if (suggestion.s != ""){
			info_html = " <span style='color:#999999;'> - "+show_suggestion_s+"</span>";
		}
		return "<b style='color:#333333'>"+show_suggestion_n+"</b>"+info_html;
	}
});
});

function high_light(str,keyworkd){
	return str.replace(keyworkd,'<span style="color:#45d5ff;">'+keyworkd+'</span>');
}