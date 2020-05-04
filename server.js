const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', function(request, response){
	response.render('index.html')
})

usuarios_logados = []
mensagens = []

io.on('connection', function(socket){
	socket.on('logado', function(usuario){
		usuarios_logados.push(usuario)
		socket.broadcast.emit('usuario_logado', usuario)
	})

	socket.on('envia_mensagem', function(dados){
		mensagens.push(dados)
		socket.broadcast.emit('mensagem_recebida', dados)
	})

	socket.on('logout', function(usuario){
		usuarios_logados.splice(usuarios_logados.indexOf(usuario), 1)
		socket.broadcast.emit('usuario_desconectado', usuario)
	})

	socket.emit('carrega_usuarios', usuarios_logados)
	socket.emit('carrega_historico', mensagens)
})

var porta = process.env.PORT || 3000;
server.listen(porta);
