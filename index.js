const http = require("http");
const fs = require("fs");


function parseCode(code) {
  const lines = code.trim().split("\n");
  let htmlOutput = "<html><head><style>";
  let cssOutput = "";
  let bodyOutput = "<body>";

  lines.forEach((line) => {
    if (line.startsWith("Line")) {
      const matchText = line.match(/Line (\d+)="(.+)"/);
      const matchCss = line.match(/Line (\d+) css="(.+)"/);
      const matchImg = line.match(/Line (\d+) img="(.+)"/);
      const matchLink = line.match(/Line (\d+) link="(.+)"/);

      const lineNum = matchText?.[1] || matchCss?.[1] || matchImg?.[1] || matchLink?.[1];

      if (matchText) {
        // Add text to the body
        const text = matchText[2];
        bodyOutput += `<p id="line${lineNum}">${text}</p>`;
      } else if (matchCss) {
        // Add CSS to the style block
        const css = matchCss[2];
        cssOutput += `#line${lineNum} { ${css} }\n`;
      } else if (matchImg) {
        // Add an image to the body
        const imgSrc = matchImg[2];
        bodyOutput += `<img id="line${lineNum}" src="${imgSrc}" alt="Image">`;
      } else if (matchLink) {
        // Add a link to the body
        const linkUrl = matchLink[2];
        bodyOutput += `<a id="line${lineNum}" href="${linkUrl}">Link</a>`;
      }
    }
  });

  htmlOutput += cssOutput + "</style></head>" + bodyOutput + "</body></html>";
  return htmlOutput;
}


function readCustomFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}


const server = http.createServer((req, res) => {
  try {
 
    const visitorIp = req.socket.remoteAddress;

    
    console.log(`a USER HAS has visited site.cstm`);

  
    const customCode = readCustomFile("site.cstm");

    const websiteContent = parseCode(customCode);


    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(websiteContent);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error generating website: " + error.message);
  }
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});