"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * An enumeration of status codes.
 */
var SpanStatusCode = exports.SpanStatusCode = undefined;
(function (SpanStatusCode) {
  /**
   * The default status.
   */
  SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
  /**
   * The operation has been validated by an Application developer or
   * Operator to have completed successfully.
   */
  SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
  /**
   * The operation contains an error.
   */
  SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (exports.SpanStatusCode = SpanStatusCode = {}));
//# sourceMappingURL=status.js.map