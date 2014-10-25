(function(g) {
  var __bem_xjst = function(exports) {
     var $$mode = "", $$block = "", $$elem = "", $$elemMods = null, $$mods = null;

var __$ref = {};

function apply(ctx) {
    ctx = ctx || this;
    $$mods = ctx["mods"];
    $$elemMods = ctx["elemMods"];
    $$elem = ctx["elem"];
    $$block = ctx["block"];
    $$mode = ctx["_mode"];
    try {
        return applyc(ctx, __$ref);
    } catch (e) {
        e.xjstContext = ctx;
        throw e;
    }
}

exports.apply = apply;

function applyc(__$ctx, __$ref) {
    var __$t = $$mode;
    if (__$t === "tag") {
        var __$t = $$block;
        if (__$t === "page") {
            var __$t = $$elem;
            if (__$t === "head") {
                return "head";
            } else if (__$t === "body") {
                return "body";
            }
        }
        return undefined;
    } else if (__$t === "bem") {
        if ($$block === "page" && $$elem === "head") {
            return false;
        }
        return undefined;
    } else if (__$t === "default") {
        var __$t = $$block;
        if (__$t === "page") {
            if ($$elem === "body" && (__$ctx.__$a0 & 1) === 0) {
                var __$r = __$b6(__$ctx, __$ref);
                if (__$r !== __$ref) return __$r;
            }
            if (!$$elem && (__$ctx.__$a0 & 2) === 0) {
                var __$r = __$b7(__$ctx, __$ref);
                if (__$r !== __$ref) return __$r;
            }
        }
        var __$r = __$b8(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    } else if (__$t === "content") {
        return __$ctx.ctx.content;
    } else if (__$t === "mix") {
        return undefined;
    } else if (__$t === "js") {
        return undefined;
    } else if (__$t === "cls") {
        return undefined;
    } else if (__$t === "attrs") {
        return undefined;
    } else if (__$t === "") {
        if (__$ctx.ctx && __$ctx.ctx._vow && (__$ctx.__$a0 & 4) === 0) {
            var __$r = __$b14(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (__$ctx.isSimple(__$ctx.ctx)) {
            var __$r = __$b15(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (!__$ctx.ctx) {
            var __$r = __$b16(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (__$ctx.isArray(__$ctx.ctx)) {
            var __$r = __$b17(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        var __$r = __$b18(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    }
}

[ function(exports, context) {
    var undef, BEM_ = {}, toString = Object.prototype.toString, slice = Array.prototype.slice, isArray = Array.isArray || function(obj) {
        return toString.call(obj) === "[object Array]";
    }, SHORT_TAGS = {
        area: 1,
        base: 1,
        br: 1,
        col: 1,
        command: 1,
        embed: 1,
        hr: 1,
        img: 1,
        input: 1,
        keygen: 1,
        link: 1,
        meta: 1,
        param: 1,
        source: 1,
        wbr: 1
    };
    (function(BEM, undefined) {
        var MOD_DELIM = "_", ELEM_DELIM = "__", NAME_PATTERN = "[a-zA-Z0-9-]+";
        function buildModPostfix(modName, modVal) {
            var res = MOD_DELIM + modName;
            if (modVal !== true) res += MOD_DELIM + modVal;
            return res;
        }
        function buildBlockClass(name, modName, modVal) {
            var res = name;
            if (modVal) res += buildModPostfix(modName, modVal);
            return res;
        }
        function buildElemClass(block, name, modName, modVal) {
            var res = buildBlockClass(block) + ELEM_DELIM + name;
            if (modVal) res += buildModPostfix(modName, modVal);
            return res;
        }
        BEM.INTERNAL = {
            NAME_PATTERN: NAME_PATTERN,
            MOD_DELIM: MOD_DELIM,
            ELEM_DELIM: ELEM_DELIM,
            buildModPostfix: buildModPostfix,
            buildClass: function(block, elem, modName, modVal) {
                var typeOfModName = typeof modName;
                if (typeOfModName === "string" || typeOfModName === "boolean") {
                    var typeOfModVal = typeof modVal;
                    if (typeOfModVal !== "string" && typeOfModVal !== "boolean") {
                        modVal = modName;
                        modName = elem;
                        elem = undef;
                    }
                } else if (typeOfModName !== "undefined") {
                    modName = undef;
                } else if (elem && typeof elem !== "string") {
                    elem = undef;
                }
                if (!(elem || modName)) {
                    return block;
                }
                return elem ? buildElemClass(block, elem, modName, modVal) : buildBlockClass(block, modName, modVal);
            },
            buildModsClasses: function(block, elem, mods) {
                var res = "";
                if (mods) {
                    var modName;
                    for (modName in mods) {
                        if (!mods.hasOwnProperty(modName)) continue;
                        var modVal = mods[modName];
                        if (!modVal && modVal !== 0) continue;
                        typeof modVal !== "boolean" && (modVal += "");
                        res += " " + (elem ? buildElemClass(block, elem, modName, modVal) : buildBlockClass(block, modName, modVal));
                    }
                }
                return res;
            },
            buildClasses: function(block, elem, mods) {
                var res = "";
                res += elem ? buildElemClass(block, elem) : buildBlockClass(block);
                res += this.buildModsClasses(block, elem, mods);
                return res;
            }
        };
    })(BEM_);
    var ts = {
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    }, f = function(t) {
        return ts[t] || t;
    };
    var buildEscape = function(r) {
        r = new RegExp(r, "g");
        return function(s) {
            return ("" + s).replace(r, f);
        };
    };
    context.BEMContext = BEMContext;
    function BEMContext(context, apply_) {
        this.ctx = typeof context === "undefined" ? "" : context;
        this.apply = apply_;
        this._str = "";
        var _this = this;
        this._buf = {
            push: function() {
                var chunks = slice.call(arguments).join("");
                _this._str += chunks;
            },
            join: function() {
                return this._str;
            }
        };
        this._ = this;
        this._start = true;
        this._mode = "";
        this._listLength = 0;
        this._notNewList = false;
        this.position = 0;
        this.block = undef;
        this.elem = undef;
        this.mods = undef;
        this.elemMods = undef;
    }
    BEMContext.prototype.isArray = isArray;
    BEMContext.prototype.isSimple = function isSimple(obj) {
        if (!obj || obj === true) return true;
        var t = typeof obj;
        return t === "string" || t === "number";
    };
    BEMContext.prototype.isShortTag = function isShortTag(t) {
        return SHORT_TAGS.hasOwnProperty(t);
    };
    BEMContext.prototype.extend = function extend(o1, o2) {
        if (!o1 || !o2) return o1 || o2;
        var res = {}, n;
        for (n in o1) o1.hasOwnProperty(n) && (res[n] = o1[n]);
        for (n in o2) o2.hasOwnProperty(n) && (res[n] = o2[n]);
        return res;
    };
    var cnt = 0, id = +new Date(), expando = "__" + id, get = function() {
        return "uniq" + id + ++cnt;
    };
    BEMContext.prototype.identify = function(obj, onlyGet) {
        if (!obj) return get();
        if (onlyGet || obj[expando]) {
            return obj[expando];
        } else {
            return obj[expando] = get();
        }
    };
    BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
    BEMContext.prototype.attrEscape = buildEscape('["&<>]');
    BEMContext.prototype.BEM = BEM_;
    BEMContext.prototype.isFirst = function isFirst() {
        return this.position === 1;
    };
    BEMContext.prototype.isLast = function isLast() {
        return this.position === this._listLength;
    };
    BEMContext.prototype.generateId = function generateId() {
        return this.identify(this.ctx);
    };
    var oldApply = exports.apply;
    exports.apply = BEMContext.apply = function BEMContext_apply(context) {
        var ctx = new BEMContext(context || this, oldApply);
        ctx.apply();
        return ctx._str;
    };
    BEMContext.prototype.reapply = BEMContext.apply;
} ].forEach(function(fn) {
    fn(exports, this);
}, {
    recordExtensions: function(ctx) {
        ctx["__$a0"] = 0;
        ctx["_mode"] = undefined;
        ctx["ctx"] = undefined;
        ctx["_str"] = undefined;
        ctx["block"] = undefined;
        ctx["elem"] = undefined;
        ctx["_notNewList"] = undefined;
        ctx["position"] = undefined;
        ctx["_listLength"] = undefined;
        ctx["_currBlock"] = undefined;
        ctx["mods"] = undefined;
        ctx["elemMods"] = undefined;
    },
    resetApplyNext: function(ctx) {
        ctx["__$a0"] = 0;
    }
});

function __$b6(__$ctx, __$ref) {
    __$ctx.ctx.elem = null;
    var __$r__$1;
    var __$l0__$2 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 1;
    __$r__$1 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l0__$2;
    return;
}

function __$b7(__$ctx, __$ref) {
    var ctx__$3 = __$ctx.ctx;
    var __$r__$5;
    var __$l0__$6 = $$mode;
    $$mode = "";
    var __$l1__$7 = __$ctx.ctx;
    __$ctx.ctx = [ ctx__$3.doctype || "<!DOCTYPE html>", {
        tag: "html",
        content: [ {
            elem: "head",
            content: [ {
                tag: "meta",
                attrs: {
                    charset: "utf-8"
                }
            }, {
                tag: "title",
                content: ctx__$3.title
            }, ctx__$3.head ]
        }, __$ctx.extend(ctx__$3, {
            elem: "body"
        }) ]
    } ];
    var __$r__$9;
    var __$l2__$10 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 2;
    __$r__$9 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l2__$10;
    __$r__$5 = __$r__$9;
    $$mode = __$l0__$6;
    __$ctx.ctx = __$l1__$7;
    return;
}

function __$b8(__$ctx, __$ref) {
    var BEM_INTERNAL__$11 = __$ctx.BEM.INTERNAL, ctx__$12 = __$ctx.ctx, isBEM__$13, tag__$14, res__$15;
    var __$r__$17;
    var __$l0__$18 = __$ctx._str;
    __$ctx._str = "";
    var vBlock__$19 = $$block;
    var __$r__$21;
    var __$l1__$22 = $$mode;
    $$mode = "tag";
    __$r__$21 = applyc(__$ctx, __$ref);
    $$mode = __$l1__$22;
    tag__$14 = __$r__$21;
    typeof tag__$14 !== "undefined" || (tag__$14 = ctx__$12.tag);
    typeof tag__$14 !== "undefined" || (tag__$14 = "div");
    if (tag__$14) {
        var jsParams__$23, js__$24;
        if (vBlock__$19 && ctx__$12.js !== false) {
            var __$r__$25;
            var __$l2__$26 = $$mode;
            $$mode = "js";
            __$r__$25 = applyc(__$ctx, __$ref);
            $$mode = __$l2__$26;
            js__$24 = __$r__$25;
            js__$24 = js__$24 ? __$ctx.extend(ctx__$12.js, js__$24 === true ? {} : js__$24) : ctx__$12.js === true ? {} : ctx__$12.js;
            js__$24 && ((jsParams__$23 = {})[BEM_INTERNAL__$11.buildClass(vBlock__$19, ctx__$12.elem)] = js__$24);
        }
        __$ctx._str += "<" + tag__$14;
        var __$r__$27;
        var __$l3__$28 = $$mode;
        $$mode = "bem";
        __$r__$27 = applyc(__$ctx, __$ref);
        $$mode = __$l3__$28;
        isBEM__$13 = __$r__$27;
        typeof isBEM__$13 !== "undefined" || (isBEM__$13 = typeof ctx__$12.bem !== "undefined" ? ctx__$12.bem : ctx__$12.block || ctx__$12.elem);
        var __$r__$30;
        var __$l4__$31 = $$mode;
        $$mode = "cls";
        __$r__$30 = applyc(__$ctx, __$ref);
        $$mode = __$l4__$31;
        var cls__$29 = __$r__$30;
        cls__$29 || (cls__$29 = ctx__$12.cls);
        var addJSInitClass__$32 = ctx__$12.block && jsParams__$23 && !ctx__$12.elem;
        if (isBEM__$13 || cls__$29) {
            __$ctx._str += ' class="';
            if (isBEM__$13) {
                __$ctx._str += BEM_INTERNAL__$11.buildClasses(vBlock__$19, ctx__$12.elem, ctx__$12.elemMods || ctx__$12.mods);
                var __$r__$34;
                var __$l5__$35 = $$mode;
                $$mode = "mix";
                __$r__$34 = applyc(__$ctx, __$ref);
                $$mode = __$l5__$35;
                var mix__$33 = __$r__$34;
                ctx__$12.mix && (mix__$33 = mix__$33 ? [].concat(mix__$33, ctx__$12.mix) : ctx__$12.mix);
                if (mix__$33) {
                    var visited__$36 = {}, visitedKey__$37 = function(block, elem) {
                        return (block || "") + "__" + (elem || "");
                    };
                    visited__$36[visitedKey__$37(vBlock__$19, $$elem)] = true;
                    __$ctx.isArray(mix__$33) || (mix__$33 = [ mix__$33 ]);
                    for (var i__$38 = 0; i__$38 < mix__$33.length; i__$38++) {
                        var mixItem__$39 = mix__$33[i__$38], hasItem__$40 = mixItem__$39.block || mixItem__$39.elem, mixBlock__$41 = mixItem__$39.block || mixItem__$39._block || $$block, mixElem__$42 = mixItem__$39.elem || mixItem__$39._elem || $$elem;
                        hasItem__$40 && (__$ctx._str += " ");
                        __$ctx._str += BEM_INTERNAL__$11[hasItem__$40 ? "buildClasses" : "buildModsClasses"](mixBlock__$41, mixItem__$39.elem || mixItem__$39._elem || (mixItem__$39.block ? undefined : $$elem), mixItem__$39.elemMods || mixItem__$39.mods);
                        if (mixItem__$39.js) {
                            (jsParams__$23 || (jsParams__$23 = {}))[BEM_INTERNAL__$11.buildClass(mixBlock__$41, mixItem__$39.elem)] = mixItem__$39.js === true ? {} : mixItem__$39.js;
                            addJSInitClass__$32 || (addJSInitClass__$32 = mixBlock__$41 && !mixItem__$39.elem);
                        }
                        if (hasItem__$40 && !visited__$36[visitedKey__$37(mixBlock__$41, mixElem__$42)]) {
                            visited__$36[visitedKey__$37(mixBlock__$41, mixElem__$42)] = true;
                            var __$r__$44;
                            var __$l6__$45 = $$mode;
                            $$mode = "mix";
                            var __$l7__$46 = $$block;
                            $$block = mixBlock__$41;
                            var __$l8__$47 = $$elem;
                            $$elem = mixElem__$42;
                            __$r__$44 = applyc(__$ctx, __$ref);
                            $$mode = __$l6__$45;
                            $$block = __$l7__$46;
                            $$elem = __$l8__$47;
                            var nestedMix__$43 = __$r__$44;
                            if (nestedMix__$43) {
                                for (var j__$48 = 0; j__$48 < nestedMix__$43.length; j__$48++) {
                                    var nestedItem__$49 = nestedMix__$43[j__$48];
                                    if (!nestedItem__$49.block && !nestedItem__$49.elem || !visited__$36[visitedKey__$37(nestedItem__$49.block, nestedItem__$49.elem)]) {
                                        nestedItem__$49._block = mixBlock__$41;
                                        nestedItem__$49._elem = mixElem__$42;
                                        mix__$33.splice(i__$38 + 1, 0, nestedItem__$49);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            cls__$29 && (__$ctx._str += isBEM__$13 ? " " + cls__$29 : cls__$29);
            __$ctx._str += addJSInitClass__$32 ? ' i-bem"' : '"';
        }
        if (isBEM__$13 && jsParams__$23) {
            __$ctx._str += ' data-bem="' + __$ctx.attrEscape(JSON.stringify(jsParams__$23)) + '"';
        }
        var __$r__$51;
        var __$l9__$52 = $$mode;
        $$mode = "attrs";
        __$r__$51 = applyc(__$ctx, __$ref);
        $$mode = __$l9__$52;
        var attrs__$50 = __$r__$51;
        attrs__$50 = __$ctx.extend(attrs__$50, ctx__$12.attrs);
        if (attrs__$50) {
            var name__$53, attr__$54;
            for (name__$53 in attrs__$50) {
                attr__$54 = attrs__$50[name__$53];
                if (typeof attr__$54 === "undefined") continue;
                __$ctx._str += " " + name__$53 + '="' + __$ctx.attrEscape(__$ctx.isSimple(attr__$54) ? attr__$54 : __$ctx.reapply(attr__$54)) + '"';
            }
        }
    }
    if (__$ctx.isShortTag(tag__$14)) {
        __$ctx._str += "/>";
    } else {
        tag__$14 && (__$ctx._str += ">");
        var __$r__$56;
        var __$l10__$57 = $$mode;
        $$mode = "content";
        __$r__$56 = applyc(__$ctx, __$ref);
        $$mode = __$l10__$57;
        var content__$55 = __$r__$56;
        if (content__$55 || content__$55 === 0) {
            isBEM__$13 = vBlock__$19 || $$elem;
            var __$r__$58;
            var __$l11__$59 = $$mode;
            $$mode = "";
            var __$l12__$60 = __$ctx._notNewList;
            __$ctx._notNewList = false;
            var __$l13__$61 = __$ctx.position;
            __$ctx.position = isBEM__$13 ? 1 : __$ctx.position;
            var __$l14__$62 = __$ctx._listLength;
            __$ctx._listLength = isBEM__$13 ? 1 : __$ctx._listLength;
            var __$l15__$63 = __$ctx.ctx;
            __$ctx.ctx = content__$55;
            __$r__$58 = applyc(__$ctx, __$ref);
            $$mode = __$l11__$59;
            __$ctx._notNewList = __$l12__$60;
            __$ctx.position = __$l13__$61;
            __$ctx._listLength = __$l14__$62;
            __$ctx.ctx = __$l15__$63;
        }
        tag__$14 && (__$ctx._str += "</" + tag__$14 + ">");
    }
    res__$15 = __$ctx._str;
    __$r__$17 = undefined;
    __$ctx._str = __$l0__$18;
    __$ctx._buf.push(res__$15);
    return;
}

function __$b14(__$ctx, __$ref) {
    var __$r__$65;
    var __$l0__$66 = $$mode;
    $$mode = "";
    var __$l1__$67 = __$ctx.ctx;
    __$ctx.ctx = __$ctx.ctx._value;
    var __$r__$69;
    var __$l2__$70 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 4;
    __$r__$69 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l2__$70;
    __$r__$65 = __$r__$69;
    $$mode = __$l0__$66;
    __$ctx.ctx = __$l1__$67;
    return;
}

function __$b15(__$ctx, __$ref) {
    __$ctx._listLength--;
    var ctx__$71 = __$ctx.ctx;
    if (ctx__$71 && ctx__$71 !== true || ctx__$71 === 0) {
        __$ctx._str += ctx__$71 + "";
    }
    return;
}

function __$b16(__$ctx, __$ref) {
    __$ctx._listLength--;
    return;
}

function __$b17(__$ctx, __$ref) {
    var ctx__$72 = __$ctx.ctx, len__$73 = ctx__$72.length, i__$74 = 0, prevPos__$75 = __$ctx.position, prevNotNewList__$76 = __$ctx._notNewList;
    if (prevNotNewList__$76) {
        __$ctx._listLength += len__$73 - 1;
    } else {
        __$ctx.position = 0;
        __$ctx._listLength = len__$73;
    }
    __$ctx._notNewList = true;
    while (i__$74 < len__$73) (function __$lb__$77() {
        var __$r__$78;
        var __$l0__$79 = __$ctx.ctx;
        __$ctx.ctx = ctx__$72[i__$74++];
        __$r__$78 = applyc(__$ctx, __$ref);
        __$ctx.ctx = __$l0__$79;
        return __$r__$78;
    })();
    prevNotNewList__$76 || (__$ctx.position = prevPos__$75);
    return;
}

function __$b18(__$ctx, __$ref) {
    __$ctx.ctx || (__$ctx.ctx = {});
    var vBlock__$80 = __$ctx.ctx.block, vElem__$81 = __$ctx.ctx.elem, block__$82 = __$ctx._currBlock || $$block;
    var __$r__$84;
    var __$l0__$85 = $$mode;
    $$mode = "default";
    var __$l1__$86 = $$block;
    $$block = vBlock__$80 || (vElem__$81 ? block__$82 : undefined);
    var __$l2__$87 = __$ctx._currBlock;
    __$ctx._currBlock = vBlock__$80 || vElem__$81 ? undefined : block__$82;
    var __$l3__$88 = $$elem;
    $$elem = vElem__$81;
    var __$l4__$89 = $$mods;
    $$mods = vBlock__$80 ? __$ctx.ctx.mods || (__$ctx.ctx.mods = {}) : $$mods;
    var __$l5__$90 = $$elemMods;
    $$elemMods = __$ctx.ctx.elemMods || {};
    $$block || $$elem ? __$ctx.position = (__$ctx.position || 0) + 1 : __$ctx._listLength--;
    applyc(__$ctx, __$ref);
    __$r__$84 = undefined;
    $$mode = __$l0__$85;
    $$block = __$l1__$86;
    __$ctx._currBlock = __$l2__$87;
    $$elem = __$l3__$88;
    $$mods = __$l4__$89;
    $$elemMods = __$l5__$90;
    return;
};
     return exports;
  }
  var defineAsGlobal = true;
  if(typeof exports === "object") {
    exports["BEMHTML"] = __bem_xjst({});
    defineAsGlobal = false;
  }
  if(typeof modules === "object") {
    modules.define("BEMHTML",
      function(provide) {
        provide(__bem_xjst({})) });
    defineAsGlobal = false;
  }
  defineAsGlobal && (g["BEMHTML"] = __bem_xjst({}));
})(this);