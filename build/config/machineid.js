"use strict";

var nodeMachineId = require("node-machine-id");

/*
Function: machineId(original)
    original <Boolean>, If true return original value of machine id, otherwise return hashed value (sha-256), default: false

Function: machineIdSync(original);
    syncronous version of machineId
*/

// MachineId 를 가져옵니다.
// 예시: c24b0fe51856497eebb6a2bfcd120247aac0d6334d670bb92e09a00ce8169365
module.exports = function () {
    return nodeMachineId.machineId();
};