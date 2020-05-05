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
		usuario.pos = usuarios_logados.length
		usuarios_logados.push(usuario)
		socket.broadcast.emit('usuario_logado', usuario)
		socket.emit('carrega_usuarios', usuarios_logados)
		socket.emit('carrega_historico', mensagens)
	})

	socket.on('envia_mensagem', function(dados){
		mensagens.push(dados)
		io.emit('mensagem_recebida', dados)
	})

	socket.on('logout', function(usuario){
		usuarios_logados.splice(usuario.pos, 1)
		socket.broadcast.emit('usuario_desconectado', usuario)
	})
})

var porta = process.env.PORT || 3000;
server.listen(porta);
