/*
I wanted to take a little time after work today to teach myself
something about video streaming from Node.

This could certainly be optimized and refactored, but I wanted 
to throw down a brute-force version to familiarize myself with the
methods.

This is making the assumption that requests are going to 
come in to the '/video' endpoint. They are coming there from 
my HTML file for testing purposes

I also worked on the assumption that the video has an endpoint --
I know that for y'all's purposes, it needs to be continuous, but as 
this was just an excercise for my own learning I'm calling it for
now.  

There is a script in the package JSON to run this with nodemon if 
you'd like to try it.

npm run start-dev

*/


import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/video', (req: Request, res: Response) => {
  const { range } = req.headers;
  if(!range){
    res.status(400).send('Requires Range Header');
  }

  const videoPath: string  = 'doggiePrimp.mp4';
  const videoSize: number = fs.statSync(videoPath).size;

  const CHUNK_SIZE: number = 10**6; //~1MB
  const start: number = Number(range?.replace(/\D/g, ""));
  const end: number = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);
  
  const videoStream = fs.createReadStream(videoPath, { start, end});
  videoStream.pipe(res);
});

//let me just start up my inifinite loop here... ;)
app.listen(3330, function(){
    console.log('listening on port 3330')
})


