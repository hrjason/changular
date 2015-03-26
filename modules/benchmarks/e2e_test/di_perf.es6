var perfUtil = require('changular2/src/test_lib/perf_util');

describe('ng2 di benchmark', function () {

  var URL = 'benchmarks/src/di/di_benchmark.html';

  afterEach(perfUtil.verifyNoBrowserErrors);

  it('should log the stats for getByToken', function(done) {
    perfUtil.runClickBenchmark({
      url: URL,
      buttons: ['#getByToken'],
      id: 'ng2.di.getByToken',
      params: [{
        name: 'iterations', value: 20000, scale: 'linear'
      }],
      microIterations: 20000
    }).then(done, done.fail);
  });

  it('should log the stats for getByKey', function(done) {
    perfUtil.runClickBenchmark({
      url: URL,
      buttons: ['#getByKey'],
      id: 'ng2.di.getByKey',
      microIterations: 20000
    }).then(done, done.fail);
  });

  it('should log the stats for getChild', function(done) {
    perfUtil.runClickBenchmark({
      url: URL,
      buttons: ['#getChild'],
      id: 'ng2.di.getChild',
      microIterations: 20000
    }).then(done, done.fail);
  });

  it('should log the stats for instantiate', function(done) {
    perfUtil.runClickBenchmark({
      url: URL,
      buttons: ['#instantiate'],
      id: 'ng2.di.instantiate',
      microIterations: 10000
    }).then(done, done.fail);
  });

});
