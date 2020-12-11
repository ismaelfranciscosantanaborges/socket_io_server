const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Miguel'));
bands.addBand(new Band('Ramon'));
bands.addBand(new Band('Maria'));
bands.addBand(new Band('Luisa'));
bands.addBand(new Band('Josefa'));
bands.addBand(new Band('Alfredo'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('get-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });

    client.on('emitir-mensaje', (payload)=>{
        // io.emit('nuevo-mensaje', payload); //Emite el mensaje a todos los usuarios
        client.broadcast.emit('nuevo-mensaje', payload); //Emit new message all user excluind me

    });

    client.on('vote-band', ( payload ) => {
        bands.voteBand(payload.id);
        io.emit('get-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {    
        bands.addBand(new Band(payload.name));
        io.emit('get-bands', bands.getBands());
    });

    client.on('delete-band', (payload) =>{
        bands.deleteBand(payload.id);
        io.emit('get-bands', bands.getBands());
    });

});
