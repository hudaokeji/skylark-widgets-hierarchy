/**
 * skylark-widgets-hierarchy - The skylark hierarchy widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-hierarchy/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","../Hierarchy"],function(e,t,n,i,s,l,o){"use strict";if(!l.jstree.plugins.conditionalselect)return l.jstree.defaults.conditionalselect=function(){return!0},l.jstree.plugins.conditionalselect=function(e,t){this.activate_node=function(e,n){if(this.settings.conditionalselect.call(this,this.get_node(e),n))return t.activate_node.call(this,e,n)}},l});
//# sourceMappingURL=../sourcemaps/addons/conditionalselect.js.map
