var assert = require('assert');
require('./common');

suite('Basic Communication', function() {
  test('server to client', function(done, server, client) {
    server.evalSync(createServerStream, 'hello');
    client.evalSync(createClientStream, 'hello');

    client.evalSync(function() {
      helloStream.on('evt', function(data) {
        emit('evt', data);
      });
      emit('return');
    });

    client.on('evt', function(data) {
      assert.deepEqual(data, {abc: 10});
      done();
    });

    server.evalSync(function() {
      helloStream.emit('evt', {abc: 10});
      emit('return');
    });
  });

  test('client to server', function(done, server, client) {
    server.evalSync(createServerStream, 'hello');
    client.evalSync(createClientStream, 'hello');

    server.evalSync(function() {
      helloStream.on('evt2', function(d1, d2) {
        emit('evt2', d1, d2);
      });
      emit('return');
    });

    server.on('evt2', function(d1, d2) {
      assert.deepEqual(d1, {abc: 1001});
      assert.equal(d2, 200);
      done();
    });

    client.evalSync(function() {
      helloStream.emit('evt2', {abc: 1001}, 200);
      emit('return');
    });
  });

  test('client to client', function(done, server, c1, c2) {
    server.evalSync(createServerStream, 'hello');
    c1.evalSync(createClientStream, 'hello');
    c2.evalSync(createClientStream, 'hello');

    c1.evalSync(function() {
      helloStream.on('evt', function(data) {
        emit('evt', data);
      });
      emit('return');
    });

    c1.on('evt', function(data) {
      assert.deepEqual(data, {abc: 10012});
      done();
    });

    c2.evalSync(function() {
      helloStream.emit('evt', {abc: 10012});
      emit('return');
    });
  });

  test('client to client', function(done, server, c1, c2) {
    server.evalSync(createServerStream, 'hello');
    c1.evalSync(createClientStream, 'hello');
    c2.evalSync(createClientStream, 'hello');

    c2.evalSync(laika.actions.createUser, {username: 'arunoda', password: '1234556'});

    c1.evalSync(function() {
      helloStream.on('evt', function(data) {
        emit('evt', this.userId, data);
      });
      emit('return');
    });

    c1.on('evt', function(userId, data) {
      assert.ok(userId);
      assert.deepEqual(data, {abc: 10012});
      done();
    });

    c2.evalSync(function() {
      helloStream.emit('evt', {abc: 10012});
      emit('return');
    });
  });

  test('emitting not fired to itself in the client', function(done, server, client) {
    server.evalSync(createServerStream, 'hello');
    client.evalSync(createClientStream, 'hello');
    var recieved = 0;

    server.evalSync(function() {
      helloStream.on('evt2', function(d1, d2) {
        emit('evt2', d1, d2);
      });
      emit('return');
    });

    server.on('evt2', function(d1, d2) {
      assert.deepEqual(d1, {abc: 1001});
      assert.equal(d2, 200);
      setTimeout(function() {
        assert.equal(recieved, 0);
        done();
      }, 200);
    });

    client.on('evt2', function() {
      recieved ++;
    });

    client.evalSync(function() {
      helloStream.on('evt2', function(data) {
        emit('evt2', data);
      });
      helloStream.emit('evt2', {abc: 1001}, 200);
      emit('return');
    });

  });

  test('client to server: pending events support', function(done, server, client) {
    server.evalSync(createServerStream, 'hello');

    server.evalSync(function() {
      helloStream.on('evt2', function(d1, d2) {
        emit('evt2', d1, d2);
      });
      emit('return');
    });

    server.on('evt2', function(d1, d2) {
      assert.deepEqual(d1, {abc: 1001});
      assert.equal(d2, 200);
      done();
    });

    client.evalSync(function() {
      var stream = new Meteor.Stream('hello');
      stream.emit('evt2', {abc: 1001}, 200);
      emit('return');
    });
  });
});