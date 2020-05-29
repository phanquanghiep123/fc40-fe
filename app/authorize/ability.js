import { Ability } from '@casl/ability';

/**
 * @description
 * define ability for application
 *
 * init is empty
 * after user loged in rules for ability will load from api
 * 
 * rules format:
 * interface Rule {
       actions: string | string[],
       subject: string | string[],
       conditions?: Object,
       fields?: string[],
       inverted?: boolean, // default is `false`
       reason?: string // mainly to specify why user can't do something.
    }
 * 
 *  e.g: BBGH has function read, update, read, delete
 *  [{actions: [read, update, cread, delete], subject: 'BBGH'}]
 *  
 *  after login:
 *  './ability'
 *  .then(responseLogin => ability.update(responseLogin.rules))
 */

export default new Ability([{ actions: ['read'], subject: 'HOME' }]);
