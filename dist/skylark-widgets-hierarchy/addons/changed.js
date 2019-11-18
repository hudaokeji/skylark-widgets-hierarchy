/**
 * skylark-widgets-hierarchy - The skylark hierarchy widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-hierarchy/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","../Hierarchy"],function(e,r,s,t,l,n,c){"use strict";if(!n.jstree.plugins.changed)return n.jstree.plugins.changed=function(e,r){var s=[];this.trigger=function(e,t){var l,n;if(t||(t={}),"changed"===e.replace(".jstree","")){t.changed={selected:[],deselected:[]};var c={};for(l=0,n=s.length;l<n;l++)c[s[l]]=1;for(l=0,n=t.selected.length;l<n;l++)c[t.selected[l]]?c[t.selected[l]]=2:t.changed.selected.push(t.selected[l]);for(l=0,n=s.length;l<n;l++)1===c[s[l]]&&t.changed.deselected.push(s[l]);s=t.selected.slice()}r.trigger.call(this,e,t)},this.refresh=function(e,t){return s=[],r.refresh.apply(this,arguments)}},n});
//# sourceMappingURL=../sourcemaps/addons/changed.js.map
