function welcome(){processKitas(),processFilter()}function processKitas(){geojson={type:"FeatureCollection",features:[]},kitas.forEach(function(e,t){kitas[t].all=parseInt(e.all),kitas[t].size=Math.pow(parseInt(e.all),.2),kitas[t].lon=parseFloat(e.alon),kitas[t].lat=parseFloat(e.alat),kitas[t].oname=kitas[t].name,kitas[t].open=isNaN(e.mo_o)?36:d3.min([+e.mo_o,+e.tu_o,+e.we_o,+e.th_o,+e.fr_o]),kitas[t].close=isNaN(e.mo_c)?48:d3.max([+e.mo_c,+e.tu_c,+e.we_c,+e.th_c,+e.fr_c]),["AWO Kita","AWO ","AWO-Kita","BOOT-KITA","Evangelische Kita ","EKG - ","EKT - ","FRÖBEL Kindergarten ","Humanistische Kita ","IB-Kita, ","Kindergarten ","Kita - ","Kita ","Kindertagesstätte ","Kita der Ev. Kirchengem. ","Kita der Kath. Kirchengem. ","Kinderladen ","Kita/","Ev. Kita ","Ev.Kita ","- ","-"].forEach(function(e){kitas[t].name.substr(0,e.length)==e&&(kitas[t].name=kitas[t].name.substr(e.length,kitas[t].name.length))}),kitas[t].name=kitas[t].name.trim(),kitas[t].name=kitas[t].name.substr(0,1).toUpperCase()+kitas[t].name.substr(1,kitas[t].name.length),filter.forEach(function(e){""==kitas[t][e]||void 0==kitas[t][e]?kitas[t][e]=[]:(kitas[t][e]=kitas[t][e].split("|"),kitas[t][e].forEach(function(a,s){kitas[t][e][s]=parseInt(a)}))}),kitas[t].fulltext=kitas[t].address+" "+kitas[t].district+" "+kitas[t].plz+" "+kitas[t].name+" "+kitas[t].parent,kitas_keys[e.id]=t,geojson.features.push({type:"Feature",properties:{data:kitas[t],class:"normal",size:kitas[t].size},geometry:{type:"Point",coordinates:[kitas[t].lon,kitas[t].lat]}})}),map.addSource("kitas-default",{type:"geojson",data:geojson}),map.addSource("kitas-active",{type:"geojson",data:geojson}),map.addSource("routing",{type:"geojson",data:{type:"FeatureCollection",features:[]}}),map.addLayer({id:"routing",type:"line",source:"routing",paint:{"line-width":{property:"type",type:"categorical",stops:[["car",1.5],["bicycle",2],["foot",2.5]]},"line-opacity":1,"line-color":{property:"type",type:"categorical",stops:[["car","#EAB83D"],["bicycle","#B04AC8"],["foot","#54AA1D"]]}}}),map.addLayer({id:"kitas-default",type:"circle",source:"kitas-default",paint:{"circle-radius":{property:"size",base:1.75,stops:[[{zoom:2,value:0},0],[{zoom:2,value:d3.max(kitas,function(e){return e.size})},3],[{zoom:22,value:0},0],[{zoom:22,value:d3.max(kitas,function(e){return e.size})},500]]},"circle-color":{property:"class",type:"categorical",stops:[["normal","rgba(230,4,51,1)"],["focussed","transparent"],["inactive","#999999"]]}}}),map.addLayer({id:"kitas-active",type:"circle",source:"kitas-active",paint:{"circle-radius":{property:"size",base:1.75,stops:[[{zoom:2,value:0},0],[{zoom:2,value:d3.max(kitas,function(e){return e.size})},8],[{zoom:22,value:0},0],[{zoom:22,value:d3.max(kitas,function(e){return e.size})},500]]},"circle-color":{property:"class",type:"categorical",stops:[["normal","transparent"],["focussed","#E60433"],["inactive","transparent"]]}}}),["kitas-default","kitas-active"].forEach(function(e){map.on("click",e,function(e){setDetails(JSON.parse(e.features[0].properties.data))}),map.on("mouseenter",e,function(){map.getCanvas().style.cursor="pointer"}),map.on("mouseleave",e,function(){map.getCanvas().style.cursor=""})}),geojson.features=geojson.features.sort(function(e,t){return e.properties.data.name<t.properties.data.name?-1:e.properties.data.name>t.properties.data.name?1:0}),setList(),d3.select("#detail-close").on("click",function(){marker_kita&&marker_kita.remove(),0==d3.selectAll("#sidemenu li.active").size()?closeSidebar():(d3.select("#details").style("display","none"),d3.selectAll(".sidebar-content").style("visibility","visible"),detailShow=!1)})}function paginate(e){var t=e.filter(function(e){return!filtersFound||("normal"==e.properties.class||"focussed"==e.properties.class)});return t=t.sort(function(e,t){return e.name<t.name?-1:e.name>t.name?1:0}),Math.floor(t.length/perpage)<pagination&&(pagination=0),[t,t.filter(function(e,t){return t>=perpage*pagination&&t<(pagination+1)*perpage})]}function setList(){d3.select("#list").node().scrollTop=0;var e=paginate(geojson.features);d3.select("#list ul").selectAll("li").remove();var t=d3.select("#list ul").selectAll("li").data(e[1]).enter().append("li");e[0].length<=perpage?d3.select("#pagination").style("display","none"):(d3.select("#pagination_info").text(pagination*perpage+1+" - "+(pagination+1)*perpage+" von "+e[0].length),d3.select("#pagination").style("display","block"),0==pagination?d3.select("#pagination_back").style("opacity",.3).style("pointer-events","none"):d3.select("#pagination_back").style("opacity",1).style("pointer-events","all"),pagination>=Math.floor(e[0].length/perpage)?d3.select("#pagination_next").style("opacity",.3).style("pointer-events","none"):d3.select("#pagination_next").style("opacity",1).style("pointer-events","all")),buildList(t,!1)}function buildList(e,t){t&&e.append("a").attr("class","favorite-remove").on("click",function(e){favorites.splice(favorites.indexOf(e.properties.data.id),1),updateFavorites()}),e.append("span").attr("class","type").text(function(e){return kitas_dict.type[e.properties.data.type]+" der "+kitas_dict.parent[e.properties.data.parent]}).on("click",function(e){setDetails(e.properties.data)}),e.append("span").attr("class","name").text(function(e){return e.properties.data.name}).on("click",function(e){setDetails(e.properties.data)}),e.append("span").attr("class","address").text(function(e){return e.properties.data.address+", "+e.properties.data.plz+" "+e.properties.data.district}).on("click",function(e){setDetails(e.properties.data)}),t&&e.append("span").attr("class","contact").html(function(e){var t=kitas[kitas_keys[e.properties.data.id]],a="";return"phone"in t&&t.phone&&void 0!=t.phone&&t.phone.length>1&&(a+=t.phone+"<br />"),"email"in t&&t.email&&void 0!=t.email&&t.email.length>1&&(a+='<a href="'+t.email+'">'+t.email+"</a>"),a})}function setDetails(e){detailShow=!0,d3.selectAll(".sidebar-content").style("visibility","hidden"),d3.selectAll("#details").style("visibility","visible"),home&&window.innerWidth>768?(d3.select("#detail-route").style("display","block").selectAll("span").text("..."),d3.json("https://tsb.ara.uberspace.de/tsb-routing/route?start="+home.lon+","+home.lat+"&end="+e.lon+","+e.lat+"&modal=multi",function(e,t){e&&console.error(e);var a={type:"FeatureCollection",features:[]};["foot","bicycle","car"].forEach(function(e){var s=Math.round(t[e].routes[0].distance);s>999?s=(s/1e3).toFixed(1)+"&nbsp;km":s+="&nbsp;m";var i=Math.round(t[e].routes[0].duration/60)+"&nbsp;min";d3.select("#detail-route-"+e+" .detail-route-distance").html(s),d3.select("#detail-route-"+e+" .detail-route-time").html(i),a.features.push({type:"Feature",properties:{type:e},geometry:t[e].routes[0].geometry})}),map.getSource("routing").setData(a)})):(d3.select("#detail-route").style("display","none"),map.getSource("routing").setData({type:"FeatureCollection",features:[]})),marker_kita&&marker_kita.remove(),marker_kita=new mapboxgl.Marker(marker_kita_el,{offset:[5.5,-22.5]}).setLngLat([e.lon,e.lat]).addTo(map),d3.select("#details .loading").style("display","block"),d3.select("#detail-content").style("display","none"),d3.select("#details").style("display","block"),d3.select("#detail-fav").classed("active",function(){return favorites.indexOf(e.id)>=0}).datum(e.id).on("click",function(){var e=d3.select(this),t=e.datum();favorites.indexOf(t)>=0?(e.classed("active",!1),favorites.splice(favorites.indexOf(t),1)):(favorites.push(t),e.classed("active",!0)),updateFavorites()}),d3.select("#detail-map").datum([e.lon,e.lat]).on("click",function(){map.flyTo({center:d3.select(this).datum(),offset:[window.innerWidth<768?0:210,50]}),window.innerWidth<768&&closeSidebar()}),openSidebar(),d3.json("./data/individual/"+e.id+"_kitas.json",function(t,a){kitas[kitas_keys[e.id]].email=a.email,kitas[kitas_keys[e.id]].phone=a.phone,d3.select("#detail-name").text(e.oname),d3.select("#detail-postcode").text(a.postcode.join(",")),a.link="https://www.berlin.de/sen/jugend/familie-und-kinder/kindertagesbetreuung/kitas/verzeichnis/"+a.link,a.emailLink="mailto:"+a.email,["link","id","num","parent","address","district","type","parentType","mapLink","phone","email","emailLink"].forEach(function(e){e.indexOf("link")>=0||e.indexOf("Link")>=0?d3.select("#detail-"+e).attr("href",a[e]):d3.select("#detail-"+e).text(a[e])}),["educational","topics","languages"].forEach(function(e){for(;""==a[e][0];)a[e].splice(0,1);0==a[e].length?d3.selectAll("#detail-"+e+"-head, #detail-"+e).style("display","none"):(d3.selectAll("#detail-"+e+"-head, #detail-"+e).style("display","block"),d3.selectAll("#detail-"+e+" li").remove(),d3.select("#detail-"+e).selectAll("li").data(a[e]).enter().append("li").text(function(e){return e.trim()}))});var s=!0;d3.select("#detail-structure-head").style("display","block");for(var i in a.structure)void 0==a.structure[i]||""==a.structure[i]?d3.select("#detail-structure-"+i+"-row").style("display","none"):(s=!1,d3.select("#detail-structure-"+i+"-row").style("display","table-row"),d3.select("#detail-structure-"+i).text(a.structure[i]));s&&d3.select("#detail-structure-head").style("display","none");var n=!0;d3.selectAll(".detail-open").style("display","block"),a.open.forEach(function(e,t){void 0!=a.open[t][0]?(n=!1,d3.select("#detail-open-"+t).html(a.open[t][0]+"<br />"+a.open[t][1])):d3.select("#detail-open-"+t).text("")}),n&&d3.selectAll(".detail-open").style("display","none"),d3.select("#details .loading").style("display","none"),d3.select("#detail-content").style("display","block")})}function updateFavorites(){d3.select("#favorites").selectAll("li").remove(),buildList(d3.select("#favorites").selectAll("li").data(geojson.features.filter(function(e){return favorites.indexOf(e.properties.data.id)>=0})).enter().append("li"),!0);var e=d3.select(".badge").text(favorites.length);favorites.length>0?e.style("visibility","visible"):e.style("visibility","hidden")}function openSidebar(){d3.select("#sidebar").classed("active")||(d3.select("#sidebar").classed("active",!0),window.innerWidth>768&&map.panTo(map.getCenter(),{duration:500,offset:{x:200,y:0}}))}function closeSidebar(){d3.select("#sidebar").classed("active")&&(d3.select("#sidebar").classed("active",!1),d3.selectAll("#sidemenu li").classed("active",!1),window.innerWidth>768&&map.panTo(map.getCenter(),{duration:500,offset:{x:-200,y:0}}))}function updateKitas(){d3.select("#search_placeholder").style("display","none"),filtersFound=!1;for(var e in selection)selection[e].length>0?(filtersFound=!0,filterElements[e].box.classed("filter-set",!0)):filterElements[e].box.classed("filter-set",!1);timeClose&&""!=timeClose||timeOpen&&""!=timeOpen?(filterElements.time.box.classed("filter-set",!0),filtersFound=!0):filterElements.time.box.classed("filter-set",!1),acceptance.over.state||acceptance.under.state?(filtersFound=!0,filterElements.age.box.classed("filter-set",!0)):filterElements.age.box.classed("filter-set",!1),filtersFound?d3.select("#reset").style("display","block"):d3.select("#reset").style("display","none"),(home||searchterm.length>0)&&(filtersFound=!0);var t=0;geojson.features.forEach(function(e,a){var s=!0;for(var i in selection)selection[i].forEach(function(e){-1==geojson.features[a].properties.data[i].indexOf(e)&&(s=!1)});timeClose&&""!=timeClose&&geojson.features[a].properties.data.close<timeClose&&(s=!1),timeOpen&&""!=timeOpen&&geojson.features[a].properties.data.open>timeOpen&&(s=!1);for(var n in acceptance)acceptance[n].state&&0==geojson.features[a].properties.data[n]&&(s=!1);var r=d3.select("#radius").property("value");if(home&&s&&geojson.features[a].properties.data.distance>r&&(s=!1),searchterm.length>=3&&s){var l=!1,o=kitas[kitas_keys[geojson.features[a].properties.data.id]];for(var c in o){"string"==typeof o[c]&&o[c].toLowerCase().trim().indexOf(searchterm)>=0&&(l=!0)}s=l}else searchterm.length<3&&searchterm.length>0&&(s=!1,d3.select("#search_placeholder").style("display","block"));s?filtersFound?(t++,geojson.features[a].properties.class="focussed"):(t++,geojson.features[a].properties.class="normal"):geojson.features[a].properties.class="inactive"}),map.setPaintProperty("kitas-active","circle-radius",t<10?10/t+5:5),map.getSource("kitas-active").setData(geojson),map.getSource("kitas-default").setData(geojson),filter.forEach(function(e){filters[e].forEach(function(t,a){filters[e][a].count=0})}),acceptance.under.count=0,acceptance.over.count=0,geojson.features.forEach(function(e){"normal"!=e.properties.class&&"focussed"!=e.properties.class||(e.properties.data.over>0&&acceptance.over.count++,e.properties.data.under>0&&acceptance.under.count++,filter.forEach(function(t){e.properties.data[t].forEach(function(e){filterKeys[t][e]in filters[t]&&filters[t][filterKeys[t][e]].count++})}))}),filter.forEach(function(e){filterElements[e].groups.data(filters[e]).style("opacity",function(e){return e.count>0?1:.2}),filterElements[e].counts.transition().tween("text",function(e){var t=d3.select(this),a=d3.interpolateNumber(parseInt(t.text()),e.count);return function(e){t.text(Math.round(a(e)))}}),filterElements[e].bars.transition().attr("x2",function(t){return scales[e](t.count)})});var a=d3.min(geojson.features.filter(function(e){return"inactive"!=e.properties.class}),function(e){return e.properties.data.open}),s=d3.max(geojson.features.filter(function(e){return"inactive"!=e.properties.class}),function(e){return e.properties.data.close});filterElements.time.groups[0].each(function(e){e<a?d3.select(this).property("disabled",!0):d3.select(this).property("disabled",!1)}),filterElements.time.groups[1].each(function(e){e>s?d3.select(this).property("disabled",!0):d3.select(this).property("disabled",!1)}),filterElements.age.groups.forEach(function(e,t){e.datum(0==t?acceptance.under:acceptance.over).style("opacity",function(e){return e.count>0?1:.2})}),filterElements.age.counts.forEach(function(e,t){e.datum(0==t?acceptance.under:acceptance.over).transition().tween("text",function(e){var t=d3.select(this),a=d3.interpolateNumber(parseInt(t.text()),e.count);return function(e){t.text(Math.round(a(e)))}})}),filterElements.age.bars.forEach(function(e,t){e.datum(0==t?acceptance.under:acceptance.over).transition().attr("x2",function(e){return scales.age(e.count)})}),setList()}function processFilter(){d3.select("#reset").on("click",function(){for(var e in selection)selection[e]=[],timeClose=!1,timeOpen=!1,acceptance.over.state=!1,acceptance.under.state=!1,filterElements.time.box.selectAll("select").property("value","");d3.selectAll(".filter-list-container li").classed("active",!1),updateKitas()});var e=d3.select("#filter-container");filter.forEach(function(e){filters[e]=[],selection[e]=[],filterKeys[e]={},filterElements[e]={titles:null,groups:null,counts:null,bars:null,box:null},kitas_dict[e].forEach(function(t,a){filters[e].push({count:0,all:0,id:a,name:t,type:e})})}),kitas.forEach(function(e){filter.forEach(function(t){e[t].forEach(function(e){filters[t][e].count++,filters[t][e].all++})}),e.over>0&&overCount++,e.under>0&&underCount++,["mo","tu","we","th","fr"].forEach(function(t){["o","c"].forEach(function(a){var s=Math.floor(parseFloat(e[t+"_"+a])),i="o"==a?timesOpen:timesClose;isNaN(s)||-1==i.indexOf(s)&&i.push(s)})})}),timesOpen.sort(),timesClose.sort(),filter.forEach(function(t){filters[t]=filters[t].filter(function(e){return""!=e.name&&"(n.v.)"!=e.name});var a=e.append("div").attr("class","filter-container");filterElements[t].box=a;var s=buildTitle(a);filterElements[t].titles=s,s.append("img").attr("src","images/icon-"+t+"@2x.png"),s.append("span").html(labels[t]+'<img src="images/icon-checkmark-top@2x.png" />');var i=a.append("ul").attr("class","filter-list-container").style("display","none");window.innerWidth<768&&(width=window.innerWidth-73)>287&&(width=287),scales[t]=d3.scaleLinear().domain([0,d3.max(filters[t],function(e){return e.count})]).range([borderRadius,width-2*borderRadius]),filters[t].sort(function(e,t){return t.count-e.count}),filters[t].forEach(function(e,a){filterKeys[t][e.id]=a});var n=i.selectAll("li").data(filters[t]).enter().append("li").on("click",function(e){d3.select(this).classed("active")?(d3.select(this).classed("active",!1),removeSelection(e)):(d3.select(this).classed("active",!0),addSelection(e))});filterElements[t].groups=n;var r=n.append("span").attr("class","label");r.append("span").text(function(e){return cleanFilterLabel(e.name)+" ("}),filterElements[t].counts=r.append("span").text(function(e){return e.count}),r.append("span").text(")");var l=n.append("svg").attr("width",width).attr("height",2*borderRadius+2);l.append("line").attr("class","bar bg").attr("x1",borderRadius).attr("y1",borderRadius+1).attr("x2",width-2*borderRadius).attr("y2",borderRadius+1),filterElements[t].bars=l.append("line").attr("class","bar data").attr("x1",borderRadius).attr("y1",borderRadius+1).attr("x2",function(e){return scales[t](e.count)}).attr("y2",borderRadius+1)}),filterElements.time={titles:null,groups:[],counts:null,bars:null,box:null},filterElements.time.box=e.append("div").attr("class","filter-container"),filterElements.time.titles=buildTitle(filterElements.time.box),filterElements.time.titles.append("img").attr("src","images/icon-time@2x.png"),filterElements.time.titles.append("span").html('Öffnungszeiten<img src="images/icon-checkmark-top@2x.png" />');var t=filterElements.time.box.append("ul").attr("class","filter-list-container clean-filter-list").style("display","none"),a=t.append("li");a.append("span").attr("class","label").append("span").text("Wann soll die Kita öffnen?");var s=a.append("select").on("change",function(){timeOpen=d3.select(this).property("value"),updateKitas()});filterElements.time.groups[0]=s.selectAll("option").data(timesOpen).enter().append("option").attr("value",function(e){return e}).text(function(e){return timeFormatter(e)}),s.append("option").attr("value","").attr("selected","selected");var i=t.append("li");i.append("span").attr("class","label").append("span").text("Bis wann soll die Kita geöffnet sein?");var n=i.append("select").on("change",function(){timeClose=d3.select(this).property("value"),updateKitas()});filterElements.time.groups[1]=n.selectAll("option").data(timesClose).enter().append("option").attr("value",function(e){return e}).text(function(e){return timeFormatter(e)}),n.append("option").attr("value","").attr("selected","selected"),filterElements.age={titles:null,groups:[],counts:[],bars:[],box:null},filterElements.age.box=e.append("div").attr("class","filter-container"),filterElements.age.titles=buildTitle(filterElements.age.box),filterElements.age.titles.append("img").attr("src","images/icon-minor@2x.png"),filterElements.age.titles.append("span").html('Alter<img src="images/icon-checkmark-top@2x.png" />');var r=filterElements.age.box.append("ul").attr("class","filter-list-container").style("display","none");scales.age=d3.scaleLinear().domain([0,d3.max([overCount,underCount])]).range([borderRadius,width-2*borderRadius]),[{label:"Unter 3 Jahre",key:"under",count:underCount},{label:"Über 3 Jahre",key:"over",count:overCount}].forEach(function(e){var t=r.datum(e).append("li").on("click",function(e){d3.select(this).classed("active")?(d3.select(this).classed("active",!1),acceptance[e.key].state=!1,updateKitas()):(d3.select(this).classed("active",!0),acceptance[e.key].state=!0,updateKitas())}),a=t.append("span").attr("class","label");a.append("span").text(e.label+" ("),filterElements.age.counts.push(a.append("span").text(e.count)),a.append("span").text(")");var s=t.append("svg").attr("width",width).attr("height",2*borderRadius+2);s.append("line").attr("class","bar bg").attr("x1",borderRadius).attr("y1",borderRadius+1).attr("x2",width-2*borderRadius).attr("y2",borderRadius+1),filterElements.age.bars.push(s.append("line").attr("class","bar data").attr("x1",borderRadius).attr("y1",borderRadius+1).attr("x2",scales.age(e.count)).attr("y2",borderRadius+1)),filterElements.age.groups.push(t)}),initDone()}function timeFormatter(e){var t=Math.floor(e/4),a=15*(e-4*t);return(t<10?"0":"")+t+":"+(a<10?"0":"")+a+" Uhr"}function buildTitle(e){return e.append("span").attr("class","filter-title").on("click",function(){var e=d3.select(this.parentNode).select(".filter-list-container");"block"==e.style("display")?(d3.selectAll(".filter-title").classed("active",!1),d3.selectAll(".filter-list-container").style("display","none")):(d3.selectAll(".filter-title").classed("active",!1),d3.selectAll(".filter-list-container").style("display","none"),d3.select(this).classed("active",!0),e.style("display","block"))})}function initDone(){d3.select("#loading .outer").transition().ease(d3.easeCubicIn).duration(500).style("opacity",0).on("end",function(){d3.select(this).remove()}),d3.select("#sidebar").transition().delay(500).ease(d3.easeCubicOut).duration(500).style("display","block").style("opacity",1),d3.selectAll("#sidemenu li").datum(function(){return d3.select(this).attr("data-item")}).on("click",function(e){d3.select(this).classed("active")&&!detailShow?(d3.selectAll("#sidemenu li").classed("active",!1),closeSidebar()):(detailShow=!1,d3.selectAll(".sidebar-content").style("visibility","visible"),marker_kita&&marker_kita.remove(),d3.selectAll("#sidemenu li").classed("active",!1),d3.select(this).classed("active",!0),d3.selectAll(".sidebar-content").style("display","none"),d3.select("#"+e).style("display","block"),openSidebar())})}function addSelection(e){-1==selection[e.type].indexOf(e.id)&&(selection[e.type].push(e.id),updateKitas())}function removeSelection(e){selection[e.type].indexOf(e.id)>=0&&selection[e.type].splice(selection[e.type].indexOf(e.id),1),updateKitas()}function cleanFilterLabel(e){return 0==e.indexOf("deutsch - ")?e.substr(10,1).toUpperCase()+e.substr(11):e.indexOf("Musik und Kunst")>-1?e.replace("Musik und Kunst","Musik & Kunst"):"("==e.substr(0,1)&&")"==e.substr(e.length-1,1)?e.indexOf("Rahmenvereinbarung")>=0?"Private Kita ohne Rahmenvereinbarung":e.indexOf("EKT")>=0?"Eltern-Initiativ-Kindertagesstätte":e.substr(1,e.length-2):e}function debouncer(e,t){var a,s=t||200;return function(){var t=this,i=arguments;clearTimeout(a),a=setTimeout(function(){e.apply(t,Array.prototype.slice.call(i))},s)}}function postcodeError(e,t){d3.select("#postcode-error").text(e),d3.select("#postcode-error").classed("error",t)}function selectStreet(e){var t=document.getElementById("address");t.blur(),t.value=e.street,d3.select("#address").attr("data-id",e.id),d3.selectAll("#autosuggest ul li").remove(),d3.select("#autosuggest").style("display","none"),d3.json("https://tsb.ara.uberspace.de/tsb-geocoding/num?street="+e.id,function(e,t){t.forEach(function(e){var t=e.num.split(""),a="",s="";t.forEach(function(e){isNaN(e)?s+=e:a+=e}),e.int=+a,e.letter=s}),t.sort(function(e,t){return e.int===t.int?e.letter<t.letter?-1:e.letter>t.letter?1:0:e.int-t.int}),d3.selectAll("#number option").remove(),d3.select("#number").selectAll("option").data([{id:-1,num:"&#9662;"}].concat(t)).enter().append("option").attr("value",function(e){return e.id}).html(function(e){return e.num})})}function calculateDistances(){geojson.features.forEach(function(e,t){var a=distance(e.geometry.coordinates[0],e.geometry.coordinates[1],home.lon,home.lat);geojson.features[t].properties.data.distance=a})}function distance(e,t,a,s){var i=.017453292519943295,n=Math.cos,r=.5-n((s-t)*i)/2+n(t*i)*n(s*i)*(1-n((a-e)*i))/2;return 12742*Math.asin(Math.sqrt(r))}var marker_kita_el=document.createElement("div");marker_kita_el.className="marker kita";var marker_home_el=document.createElement("div");marker_home_el.className="marker home";var marker_kita=!1,marker_home=!1,favorites=[];window.onbeforeunload=function(){if(favorites.length>=1)return"Aus Datenschutzgründen wird die Merkliste beim Verlassen der Seite gelöscht. Sind Sie sicher, dass Sie gehen wollen?"};var kitas,kitas_dict,kitas_keys={},selection={},labels={type:"Art der Einrichtung",languages:"Mehrsprachigkeit",topics:"Thematische Schwerpunkte",educational:"Pädagogische Schwerpunkte",parentType:"Träger"},detailShow=!1,geojson={},filterElements={},filterKeys={},postcodes=null,postcodeKeys=[],searchterm="",scales={},timeOpen=!1,timeClose=!1,borderRadius=2.5,width=287,timesOpen=[],timesClose=[],acceptance={over:{key:"over",count:0,state:!1},under:{key:"under",count:0,state:!1}},overCount=0,underCount=0,filter=["type","languages","topics","educational","parentType"],filters={},home=!1,init=!1,map=new mapboxgl.Map({container:"map",style:"style.json",center:[13.4244,52.5047],zoom:10});map.on("load",function(e){init||(init=!0,d3.queue().defer(d3.csv,"data/kitas_clean.csv").defer(d3.json,"data/kitas_dict.json").defer(d3.csv,"data/plz.csv").await(function(e,t,a,s){e?console.error(e):(kitas=t,kitas_dict=a,postcodes=s,postcodes.forEach(function(e){postcodeKeys.push(e.id)})),welcome()}))}),map.fitBounds([[13.0790332437,52.3283651024],[13.7700526861,52.6876624308]],{offset:[0,50],speed:999});var pagination=0,perpage=10;d3.select("#pagination_next").on("click",function(){pagination++,setList()}),d3.select("#pagination_back").on("click",function(){pagination--,setList()});var filtersFound;d3.select("#searchfield").on("keyup",function(){var e=this.value.toLowerCase().trim();searchterm=e,pagination=0,debouncer(updateKitas(),200)}),d3.select("#postcode-input").on("keyup",function(){var e=this.value.trim();if(5==e.length){var t=postcodeKeys.indexOf(e);t>=0?(map.fitBounds([postcodes[t].xmin,postcodes[t].ymin,postcodes[t].xmax,postcodes[t].ymax]),window.innerWidth<768&&closeSidebar(),postcodeError("Nutzen Sie auch die Filter um die Auswahl einzuschränken.",!1)):postcodeError("Dies ist keine Berliner Postleitzahlen.",!0)}else e.length>5?postcodeError("Postleitzahlen bestehen aus 5 Ziffern.",!0):postcodeError("",!1)});var active_selection=0;d3.select("#address").on("keyup",function(){var e=d3.selectAll("#autosuggest ul li").size();e>=1&&(40==d3.event.keyCode||38==d3.event.keyCode||13==d3.event.keyCode)?(40==d3.event.keyCode?active_selection<e&&active_selection++:38==d3.event.keyCode&&active_selection>=1&&active_selection--,d3.selectAll("#autosuggest ul li").classed("active",!1),active_selection>0&&d3.select("#autosuggest ul li:nth-child("+active_selection+")").classed("active",!0),13==d3.event.keyCode&&selectStreet(d3.select("#autosuggest ul li:nth-child("+active_selection+")").datum())):this.value.length>2&&(d3.selectAll("#number option").remove(),d3.json("https://tsb.ara.uberspace.de/tsb-geocoding/street?street="+this.value,function(e,t){active_selection=0,d3.selectAll("#autosuggest ul li").remove(),d3.select("#autosuggest").style("display","block"),d3.select("#autosuggest ul").selectAll("li").data(t).enter().append("li").append("a").html(function(e){return"&raquo;&nbsp;"+e.street+(parseInt(e.plz)>0?" "+e.plz:"")}).on("click",function(){selectStreet(d3.select(this).datum())})}))}),d3.select("#radius").on("change",function(){updateKitas()}),d3.select("#number").on("change",function(){var e=d3.select(this).property("value");if(-1!=e){null!=d3.select("#address").attr("data-id")&&e&&d3.json("https://tsb.ara.uberspace.de/tsb-geocoding/geo?num="+e,function(e,t){home={lon:t.lat,lat:t.lon},marker_home&&marker_home.remove(),marker_home=new mapboxgl.Marker(marker_home_el,{offset:[5.5,-22.5]}).setLngLat([t.lat,t.lon]).addTo(map),d3.select("#plz-reset").style("display","block").on("click",function(){d3.selectAll("#number option").remove(),d3.select("#address").node().value="",home=!1,map.getSource("routing").setData({type:"FeatureCollection",features:[]}),marker_home.remove(),updateKitas(),d3.select("#plz-reset").style("display","none")}),calculateDistances(),updateKitas()})}});