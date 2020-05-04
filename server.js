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

mensagens = []

io.on('connection', function(socket){
	console.log('Usuario conectado')

	socket.emit('carrega_historico', mensagens)

	socket.on('envia_mensagem', function(dados){
		mensagens.push(dados)
		socket.broadcast.emit('mensagem_recebida', dados)
	})
})

var porta = process.env.PORT || 3000;
server.listen(porta);
