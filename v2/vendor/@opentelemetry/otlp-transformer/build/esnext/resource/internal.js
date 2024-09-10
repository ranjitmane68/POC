'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createResource = createResource;

var _internal = require('../common/internal');

function createResource(resource) {
    return {
        attributes: (0, _internal.toAttributes)(resource.attributes),
        droppedAttributesCount: 0
    };
}
//# sourceMappingURL=internal.js.map