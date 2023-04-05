
const rp = require('request-promise-native')
const dotenv = require('dotenv');
const { resolve } = require('path');
const { rejects } = require('assert');
dotenv.config()


const { spawn } = require('child_process');

function createCompletionChatGTP(req) {
  return new Promise((resolve, reject) => {
    console.log("ask : " + req.message);

    const pythonScript = spawn('python', ['chatgpt.py', req.message], {
      detached: false,
    });

    let data = '';
    let json = null;

    pythonScript.stdout.on('data', (chunk) => {
      json = JSON.parse(chunk);
      data = json.choices[0].message.content.trim();      
    });

    pythonScript.on('close', (code) => {
      console.log(`Python script closed with code ${code}`);
      if (code === 0) {        
        // console.log("createCompletionChatGTP data : " + data);
        resolve(json);
      } else {
        reject(new Error(`Python script exited with error code ${code}`));
      }
    });
  });
}

// async function createCompletionChatGTP(req) {
//   console.log("ask : " +  req.message)
//   const response = await rp({
//     method: 'POST',
//     uri: 'https://api.openai.com/v1/engines/davinci-codex/completions',
//     headers: {
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       'OpenAI-Organization': `${process.env.ORG_KEY}`,
//     },
//     body: JSON.stringify({
//       prompt: req.message,
//       max_tokens: 2048,
//       temperature: 0.5,
//       top_p: 0.9,
//       n: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     }),
//   })
//   const json = JSON.parse(response)
//   return json.choices[0].text.trim()
// }

module.exports = { createCompletionChatGTP };
