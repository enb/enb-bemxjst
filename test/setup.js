var chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

// hack for mock-fs
require('../lib/bundle');
