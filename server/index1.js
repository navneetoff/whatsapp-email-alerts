const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var Imap = require("imap");
const simpleParser = require('mailparser').simpleParser;
var Promise = require("bluebird");
Promise.longStackTraces();
require('dotenv').config();

app  = express();

app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
})); 

// const { Client } = require('whatsapp-web.js');
// const client = new Client({
//     webVersionCache: {
//         type: "remote",
//         remotePath:
//           "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
//       },
//     restartOnAuthFail: true, // related problem solution
//     puppeteer: {
//       headless: true,
//       args: ['--no-sandbox']
//     }
// });

// app.get('/', async (req, res) => {
//     client.on('disconnected', (reason) => {
//         // Destroy and reinitialize the client when disconnected
//         client.destroy();
//         client.initialize();
//       });
//     let qr = await new Promise((resolve, reject) => {
//         client.once('qr', (qr) =>
//          resolve(qr)
//          )
//     })
//     res.send(qr)
    
// })

// const express = require("express");
// const bodyParser = require("body-parser");
const twilio = require("twilio");
// const cors = require('cors');


// client.initialize();
// client.on('ready', () => {
//     console.log('Client is ready!');
//     // client.sendMessage(chatId,text);
// });
app.post('/okok', async(req,res) =>{
    var needed = req.body.mailid;
    var phonenumber1 = req.body.number;
    var password = req.body.password;
    console.log(phonenumber1);
    console.log(password);
    const phonenumber = `+91${phonenumber1}`;
    var imapConfig = {
      user: `${needed}`,
      password: `${password}`,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions:{rejectUnauthorized:false}
  };
//   node_modules/whatsapp-web.js/src/util/Injected.js
  var imap = new Imap(imapConfig);
  Promise.promisifyAll(imap);
  
  imap.once("ready", execute);
  imap.once("error", function(err) {
      console.log("Connection error: " + err.stack);
  });
  
  imap.connect();
// console.log("Connection");
// client.sendMessage(phonenumber,"hello world!");
 
  function execute() {
      imap.openBox("INBOX", false, function(err, mailBox) {
          if (err) {
              console.error(err);
              return;
          }
          imap.search(["UNSEEN"], function(err, results) {
              if(!results || !results.length){console.log("No unread mails");imap.end();return;}
              //  mark as seen
          imap.setFlags(results, ['\\Seen'], function(err) {
                  if (!err) {
                      console.log("marked as read");
                  } else {
                      console.log(JSON.stringify(err, null, 2));
                  }
              });
  
              var f = imap.fetch(results, { bodies: ""});
              f.on("message", processMessage);
              f.once("error", function(err) {
                  return Promise.reject(err);
              });
              f.once("end", function() {
                  console.log("Done fetching all unseen messages.");
                  imap.end();
              });
          });
      });
  }
  
  function processMessage(msg, seqno) {
      console.log("Processing msg #" + seqno);
      // console.log(msg);
      var prefix = '(#' + seqno + ') ';
  
       msg.on("body", function(stream) {
        simpleParser(stream, (err, mail) => {
            console.log(prefix + mail.subject);
            // console.log(prefix + mail.text);
            console.log(prefix + mail.from.text);
            var printedmsg = `Mail from "${mail.from.text}" ___ With Subject: "${mail.subject}" `
            console.log(printedmsg);
            

            // console.log(mail.text);
            const accountSid = 'ACc62772955d6b7d638c65f43b5a50b9fa';
            const authToken = 'f6a196785754ef3a554cdba7e95cca0c';
            const client = require('twilio')(accountSid, authToken);
            console.log(phonenumber);
            console.log("hello");
            client.messages
                    .create({
                        body: printedmsg,
                        from: 'whatsapp:+14155238886',
                        to: `whatsapp:+918125727091`
                    })
                    .then(message => console.log(message.sid));
            // client.sendMessage(phonenumber,printedmsg);
            
        });
        
    });
    msg.once("end", function() {
        console.log("Finished msg #" + seqno);
        
    });
}

res.send('saved')
})

port = process.env.PORT || 8001
app.listen(port, () => {console.log('Client is listeningto port 8001!');});

