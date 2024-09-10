'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SugaredTracer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.wrapTracer = wrapTracer;

var _ = require('../../');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOnException = function defaultOnException(e, span) {
    span.recordException(e);
    span.setStatus({
        code: _.SpanStatusCode.ERROR
    });
};
/**
 * return a new SugaredTracer created from the supplied one
 * @param tracer
 */
function wrapTracer(tracer) {
    return new SugaredTracer(tracer);
}

var SugaredTracer = exports.SugaredTracer = function () {
    function SugaredTracer(tracer) {
        _classCallCheck(this, SugaredTracer);

        this._tracer = tracer;
        this.startSpan = tracer.startSpan.bind(this._tracer);
        this.startActiveSpan = tracer.startActiveSpan.bind(this._tracer);
    }

    _createClass(SugaredTracer, [{
        key: 'withActiveSpan',
        value: function withActiveSpan(name, arg2, arg3, arg4) {
            var _massageParams = massageParams(arg2, arg3, arg4),
                opts = _massageParams.opts,
                ctx = _massageParams.ctx,
                fn = _massageParams.fn;

            return this._tracer.startActiveSpan(name, opts, ctx, function (span) {
                return handleFn(span, opts, fn);
            });
        }
    }, {
        key: 'withSpan',
        value: function withSpan(name, arg2, arg3, arg4) {
            var _massageParams2 = massageParams(arg2, arg3, arg4),
                opts = _massageParams2.opts,
                ctx = _massageParams2.ctx,
                fn = _massageParams2.fn;

            var span = this._tracer.startSpan(name, opts, ctx);
            return handleFn(span, opts, fn);
        }
    }]);

    return SugaredTracer;
}();
/**
 * Massages parameters of withSpan and withActiveSpan to allow signature overwrites
 * @param arg
 * @param arg2
 * @param arg3
 */


function massageParams(arg, arg2, arg3) {
    var opts = void 0;
    var ctx = void 0;
    var fn = void 0;
    if (!arg2 && !arg3) {
        fn = arg;
    } else if (!arg3) {
        opts = arg;
        fn = arg2;
    } else {
        opts = arg;
        ctx = arg2;
        fn = arg3;
    }
    opts = opts !== null && opts !== void 0 ? opts : {};
    ctx = ctx !== null && ctx !== void 0 ? ctx : _.context.active();
    return { opts: opts, ctx: ctx, fn: fn };
}
/**
 * Executes fn, returns results and runs onException in the case of exception to allow overwriting of error handling
 * @param span
 * @param opts
 * @param fn
 */
function handleFn(span, opts, fn) {
    var _a;
    var onException = (_a = opts.onException) !== null && _a !== void 0 ? _a : defaultOnException;
    var errorHandler = function errorHandler(e) {
        onException(e, span);
        span.end();
        throw e;
    };
    try {
        var ret = fn(span);
        // if fn is an async function, attach a recordException and spanEnd callback to the promise
        if (typeof (ret === null || ret === void 0 ? void 0 : ret.then) === 'function') {
            return ret.then(function (val) {
                span.end();
                return val;
            }, errorHandler);
        }
        span.end();
        return ret;
    } catch (e) {
        // add throw to signal the compiler that this will throw in the inner scope
        throw errorHandler(e);
    }
}
//# sourceMappingURL=SugaredTracer.js.map