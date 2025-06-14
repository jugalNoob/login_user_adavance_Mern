const os = require('os');
const cluster = require('node:cluster');
const process = require('node:process');
const numCPUs = os.cpus().length;


const startServer = (app, port) => {  // port :: 9000 ,
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
        
        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            // cluster.fork();
            let worker = cluster.fork();
            worker.send('hi there'); // Sending a message to the worker
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died  code ${code} with signal ${signal}`);
            
            if (signal) {
                console.log(`Worker was killed by signal: ${signal}`);
            } else if (code !== 0) {
                console.log(`Worker exited with error code: ${code}`);
            } else {
                console.log('Worker success!');
            }
            
            cluster.on('disconnect', (worker) => {
                console.log(`The worker #${worker.id} has disconnected`);
            });
            
            cluster.fork();  // Rsestart a worker if it dies
        });

    } else {

        process.on('message', (message) => {
            console.log(`Worker ${process.pid} received message: ${message}`);
        });

        app.get("/io" , (req,res)=>{
            res.send(`Worker ${process.pid} is`);
        })
        const server =      app.listen(port, () => {
            console.log(`Worker ${process.pid} is running at http://localhost:${port}`);
        });

        server.on('error', (error) => {
            console.error('Server failed to start:', error);
        });
    
    }
};
 module.exports = startServer;