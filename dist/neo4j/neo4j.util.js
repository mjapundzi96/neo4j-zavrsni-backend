"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_driver_1 = require("neo4j-driver");
exports.createDriver = async (config) => {
    const driver = neo4j_driver_1.default.driver(`${config.scheme}://${config.host}:${config.port}`, neo4j_driver_1.default.auth.basic(config.username, config.password));
    await driver.verifyConnectivity();
    return driver;
};
//# sourceMappingURL=neo4j.util.js.map