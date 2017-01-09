// start up server
import './../imports/startup/server/server-index';

import './../imports/api/documents/both/methods';

if(process.env.NODE_ENV === 'test') {
  console.log('ProseMeteor server started.');
}
export { ProseMeteorServer } from './../imports/api/prosemeteor/server/prosemeteor-server';
