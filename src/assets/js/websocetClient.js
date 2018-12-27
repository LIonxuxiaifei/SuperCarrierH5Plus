const ws = {
  wsServer: 'ws://localhost:2458',
  websocket: null,
  init: function () {
    this.websocket = new WebSocket(this.wsServer)
    this.websocket.onopen = function (evt) {
      console.log('连接到websocket服务端')
      this.websocket.send('{"manager_id": "1"}')
    }
    this.websocket.onclose = function (evt) {
      console.log('关闭socket')
    }
    this.websocket.onmessage = function (evt) {
      console.log('接收服务端推送的信息: ' + evt.data)
    }
    this.websocket.onerror = function (evt) {
      console.log('socket连接错误: ' + evt.data)
    }
  },
  submit: function (msg) {

  }
}

export default ws
