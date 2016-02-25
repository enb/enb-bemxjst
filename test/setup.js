var chai = require('chai');

chai.should();

var JobQueueStub = require('mock-enb/lib/job-queue-stub');

// Использование mock-fs не позволяет подключить bemxjst-processor в рантайме
// https://github.com/tschaub/mock-fs/issues/12
// поэтому подключаем его перед инициализацией mock-fs
JobQueueStub.prototype.processor = require('../lib/bemxjst-processor');

// hack for mock-fs
require('../lib/bundle');
