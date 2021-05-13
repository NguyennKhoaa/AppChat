export let pushSocketIdArray = (client, userid, socketid) => {
  if (client[userid]) {
    client[userid].push(socketid);
  } else {
    client[userid] = [socketid];

  }
  return client;
}
export let emitNotifyToArray = (client, userid, io, eventName, data) => {
  client[userid].forEach(socketid => io.sockets.connected[socketid].emit(eventName, data));
}
export let removeSocketIdToArry = (client, userid, socket) => {
  client[userid] = client[userid].filter((socketId) => {
    return socketId !== socket.id;
  });
  if (!client[userid].length) {
    delete client[userid];

  }
  return client;
}