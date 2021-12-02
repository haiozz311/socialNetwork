let users = [];

const SocketServer = (socket) => {
  // Connect - Disconnect

  socket.on('joinUser', user => {
    users.push({ id: user._id, socketId: socket.id, followers: user.followers });
})
  socket.on("disconnect", (id) => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log(users);
  });

  //like
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  socket.on('unLikePost', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id]
    const clients = users.filter(user => ids.includes(user.id))

    if(clients.length > 0){
        clients.forEach(client => {
            socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
        })
    }
  })
   // Comments
  socket.on('createComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id]
    const clients = users.filter(user => ids.includes(user.id))

    if(clients.length > 0){
        clients.forEach(client => {
            socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
        })
    }
  })
  
  socket.on('deleteComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id]
    const clients = users.filter(user => ids.includes(user.id))

    if(clients.length > 0){
        clients.forEach(client => {
            socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
        })
    }
  })
      // Follow
  socket.on('follow', newUser => {
    const user = users.find(user => user.id === newUser._id);
    console.log('socket follow', user);
    if (user) {
      socket.to(`${user.socketId}`).emit('followToClient', newUser)
      }
  })
  
  socket.on('unfollow', newUser => {
    const user = users.find(user => user.id === newUser._id);
    console.log('socket follow', user);
    if (user) {
      socket.to(`${user.socketId}`).emit('unfollowToClient', newUser)
      }
    })
};
module.exports = SocketServer;
