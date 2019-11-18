define([], function () {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    define([
        'skylark-langx/langx',
        'skylark-domx-browser',
        'skylark-domx-eventer',
        'skylark-domx-noder',
        'skylark-domx-geom',
        'skylark-domx-query',
        './menu',
        '../Hierarchy'
    ], function (langx, browser, eventer, noder, geom, $, menu, jstree) {
        if ($.jstree.plugins.contextmenu) {
            return;
        }
        $.jstree.defaults.contextmenu = {
            select_node: true,
            show_at_node: true,
            items: function (o, cb) {
                return {
                    'create': {
                        'separator_before': false,
                        'separator_after': true,
                        '_disabled': false,
                        'label': 'Create',
                        'action': function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {}, 'last', function (new_node) {
                                try {
                                    inst.edit(new_node);
                                } catch (ex) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                }
                            });
                        }
                    },
                    'rename': {
                        'separator_before': false,
                        'separator_after': false,
                        '_disabled': false,
                        'label': 'Rename',
                        'action': function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.edit(obj);
                        }
                    },
                    'remove': {
                        'separator_before': false,
                        'icon': false,
                        'separator_after': false,
                        '_disabled': false,
                        'label': 'Delete',
                        'action': function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            if (inst.is_selected(obj)) {
                                inst.delete_node(inst.get_selected());
                            } else {
                                inst.delete_node(obj);
                            }
                        }
                    },
                    'ccp': {
                        'separator_before': true,
                        'icon': false,
                        'separator_after': false,
                        'label': 'Edit',
                        'action': false,
                        'submenu': {
                            'cut': {
                                'separator_before': false,
                                'separator_after': false,
                                'label': 'Cut',
                                'action': function (data) {
                                    var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                                    if (inst.is_selected(obj)) {
                                        inst.cut(inst.get_top_selected());
                                    } else {
                                        inst.cut(obj);
                                    }
                                }
                            },
                            'copy': {
                                'separator_before': false,
                                'icon': false,
                                'separator_after': false,
                                'label': 'Copy',
                                'action': function (data) {
                                    var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                                    if (inst.is_selected(obj)) {
                                        inst.copy(inst.get_top_selected());
                                    } else {
                                        inst.copy(obj);
                                    }
                                }
                            },
                            'paste': {
                                'separator_before': false,
                                'icon': false,
                                '_disabled': function (data) {
                                    return !$.jstree.reference(data.reference).can_paste();
                                },
                                'separator_after': false,
                                'label': 'Paste',
                                'action': function (data) {
                                    var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                                    inst.paste(obj);
                                }
                            }
                        }
                    }
                };
            }
        };
        $.jstree.plugins.contextmenu = function (options, parent) {
            this.bind = function () {
                parent.bind.call(this);
                var last_ts = 0, cto = null, ex, ey;
                this.element.on('init.jstree loading.jstree ready.jstree', $.proxy(function () {
                    this.get_container_ul().addClass('jstree-contextmenu');
                }, this)).on('contextmenu.jstree', '.jstree-anchor', $.proxy(function (e, data) {
                    if (e.target.tagName.toLowerCase() === 'input') {
                        return;
                    }
                    e.preventDefault();
                    last_ts = e.ctrlKey ? +new Date() : 0;
                    if (data || cto) {
                        last_ts = +new Date() + 10000;
                    }
                    if (cto) {
                        clearTimeout(cto);
                    }
                    if (!this.is_loading(e.currentTarget)) {
                        this.show_contextmenu(e.currentTarget, e.pageX, e.pageY, e);
                    }
                }, this)).on('click.jstree', '.jstree-anchor', $.proxy(function (e) {
                    if (this._data.contextmenu.visible && (!last_ts || +new Date() - last_ts > 250)) {
                        menu.hide();
                    }
                    last_ts = 0;
                }, this)).on('touchstart.jstree', '.jstree-anchor', function (e) {
                    if (!e.originalEvent || !e.originalEvent.changedTouches || !e.originalEvent.changedTouches[0]) {
                        return;
                    }
                    ex = e.originalEvent.changedTouches[0].clientX;
                    ey = e.originalEvent.changedTouches[0].clientY;
                    cto = setTimeout(function () {
                        $(e.currentTarget).trigger('contextmenu', true);
                    }, 750);
                }).on('touchmove.vakata.jstree', function (e) {
                    if (cto && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] && (Math.abs(ex - e.originalEvent.changedTouches[0].clientX) > 10 || Math.abs(ey - e.originalEvent.changedTouches[0].clientY) > 10)) {
                        clearTimeout(cto);
                        menu.hide();
                    }
                }).on('touchend.vakata.jstree', function (e) {
                    if (cto) {
                        clearTimeout(cto);
                    }
                });
                $(document).on('context_hide.sbswt.popup', $.proxy(function (e, data) {
                    this._data.contextmenu.visible = false;
                    $(data.reference).removeClass('jstree-context');
                }, this));
            };
            this.teardown = function () {
                if (this._data.contextmenu.visible) {
                    menu.hide();
                }
                parent.teardown.call(this);
            };
            this.show_contextmenu = function (obj, x, y, e) {
                obj = this.get_node(obj);
                if (!obj || obj.id === $.jstree.root) {
                    return false;
                }
                var s = this.settings.contextmenu, d = this.get_node(obj, true), a = d.children('.jstree-anchor'), o = false, i = false;
                if (s.show_at_node || x === undefined || y === undefined) {
                    o = a.offset();
                    x = o.left;
                    y = o.top + this._data.core.li_height;
                }
                if (this.settings.contextmenu.select_node && !this.is_selected(obj)) {
                    this.activate_node(obj, e);
                }
                i = s.items;
                if ($.isFunction(i)) {
                    i = i.call(this, obj, $.proxy(function (i) {
                        this._show_contextmenu(obj, x, y, i);
                    }, this));
                }
                if ($.isPlainObject(i)) {
                    this._show_contextmenu(obj, x, y, i);
                }
            };
            this._show_contextmenu = function (obj, x, y, i) {
                var d = this.get_node(obj, true), a = d.children('.jstree-anchor');
                $(document).one('context_show.sbswt.popup', $.proxy(function (e, data) {
                    var cls = 'jstree-contextmenu jstree-' + this.get_theme() + '-contextmenu';
                    $(data.element).addClass(cls);
                    a.addClass('jstree-context');
                }, this));
                this._data.contextmenu.visible = true;
                menu.popup(a, {
                    'x': x,
                    'y': y
                }, i);
                this.trigger('show_contextmenu', {
                    'node': obj,
                    'x': x,
                    'y': y
                });
            };
        };
        return $;
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});