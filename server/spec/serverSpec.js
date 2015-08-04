/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-03 20:44:57
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-03 21:47:44
*/

'use strict';

var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../serverSetup.js');


describe('basic server connection test', function() {
  
  it('is connecting locally', function(done) {
    // Pass in server to supertest
    request(app)
      .get('/')
      .expect(200)
      // Send request to supertest server. 
      .end(function(err, res) {
        if (err) return done(err);
        console.log('Data:', res.text);
        done();
      });
  });

});