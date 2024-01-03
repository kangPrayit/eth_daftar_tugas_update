const DaftarTugas = artifacts.require("DaftarTugas");

module.exports = function(_deployer) {
  _deployer.deploy(DaftarTugas);
};
