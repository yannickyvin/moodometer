(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{156:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(44),c=n.n(r),s=(n(58),n(2)),u=n.n(s),i=n(6),l=n(45),d=n(46),p=n(51),m=n(47),f=n(52),b=n(26),h=n(50),v=(n(61),n(48)),w="https://8q59dxk0l3.execute-api.ap-southeast-2.amazonaws.com/dev/mood",g=function(){var e=Object(i.a)(u.a.mark(function e(){var t,n;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(w);case 3:return t=e.sent,e.next=6,t.json();case 6:return n=e.sent,e.abrupt("return",n);case 10:e.prev=10,e.t0=e.catch(0),console.error(e.t0);case 13:case"end":return e.stop()}},e,null,[[0,10]])}));return function(){return e.apply(this,arguments)}}(),y=function(){var e=Object(i.a)(u.a.mark(function e(t){var n,a;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,console.log("Posting mood",t),e.next=4,fetch(w,{method:"POST",body:JSON.stringify(t)});case 4:return n=e.sent,e.next=7,n.json();case 7:return a=e.sent,console.log("Updated mood",a),e.abrupt("return",a);case 12:e.prev=12,e.t0=e.catch(0),console.error(e.t0);case 15:case"end":return e.stop()}},e,null,[[0,12]])}));return function(t){return e.apply(this,arguments)}}(),j={question:"How do you feel today?",options:[{id:"red",label:"so-so",button:"btn-danger",color:"#dc3545"},{id:"yellow",label:"good",button:"btn-warning",color:"#ffc107"},{id:"green",label:"great",button:"btn-success",color:"#28a745"}]},O=function(e){return Object.assign.apply(Object,[{}].concat(Object(h.a)(j.options.map(function(t){var n;return n={},Object(b.a)(n,t.id,0),Object(b.a)(n,e,1),n}))))},k=function(e){var t=e.onSelect;return o.a.createElement("div",null,j.options.map(function(e){return o.a.createElement("button",{key:e.id,className:"btn ".concat(e.button," btn-lg m-2"),onClick:function(){return t(e.id)}},e.label)}))},x=function(e){var t=e.mood;return o.a.createElement(v.a,{height:120,options:{maintainAspectRatio:!1,legend:!1,rotation:1.57},data:{labels:j.options.map(function(e){return e.label}),datasets:[{data:t&&j.options.map(function(e){return t[e.id]}),backgroundColor:j.options.map(function(e){return e.color})}]}})},E=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(o)))).state={teamMood:null},n.renderUserVote=function(e){var t=n.state.teamMood;t[e]++,n.setState({teamMood:t})},n.handleSelect=function(){var e=Object(i.a)(u.a.mark(function e(t){var a,o;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n.renderUserVote(t),a=O(t),e.next=4,y(a);case 4:o=e.sent,n.setState({teamMood:o});case 6:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n}return Object(f.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=Object(i.a)(u.a.mark(function e(){var t;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g();case 2:t=e.sent,this.setState({teamMood:t});case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement("header",{className:"App-header"},o.a.createElement("p",null,j.question),o.a.createElement(k,{onSelect:this.handleSelect}),o.a.createElement("div",{className:"fixed-bottom"},o.a.createElement(x,{mood:this.state.teamMood}))))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},53:function(e,t,n){e.exports=n(156)},58:function(e,t,n){},61:function(e,t,n){}},[[53,1,2]]]);
//# sourceMappingURL=main.ad5d9ff1.chunk.js.map