/**
 * skylark-widgets-hierarchy - The skylark hierarchy widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-hierarchy/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","../Hierarchy"],function(e,t,r,n,s,o,i){"use strict";if(!o.jstree.plugins.sort)return o.jstree.defaults.sort=function(e,t){return this.get_text(e)>this.get_text(t)?1:-1},o.jstree.plugins.sort=function(t,r){this.bind=function(){r.bind.call(this),this.element.on("model.jstree",e.proxy(function(e,t){this.sort(t.parent,!0)},this)).on("rename_node.jstree create_node.jstree",e.proxy(function(e,t){this.sort(t.parent||t.node.parent,!1),this.redraw_node(t.parent||t.node.parent,!0)},this)).on("move_node.jstree copy_node.jstree",e.proxy(function(e,t){this.sort(t.parent,!1),this.redraw_node(t.parent,!0)},this))},this.sort=function(t,r){var n,s;if((t=this.get_node(t))&&t.children&&t.children.length&&(t.children.sort(e.proxy(this.settings.sort,this)),r))for(n=0,s=t.children_d.length;n<s;n++)this.sort(t.children_d[n],!1)}},o});
//# sourceMappingURL=../sourcemaps/addons/sort.js.map
