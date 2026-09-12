import http from "node:http"
import { fileURLToPath } from "node:url"
import handler from "serve-handler"

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url))
const server = http.createServer((request, response) => {
  handler(request, response, {
    public: publicDirectory,
    cleanUrls: true,
    trailingSlash: false,
    headers: [{ source: "**/*", headers: [{ key: "Cache-Control", value: "no-store" }] }],
  }).catch((error) => {
    console.error(error)
    if (!response.headersSent) response.writeHead(500)
    response.end("Local preview error")
  })
})

server.on("error", (error) => {
  console.error(error.message)
  process.exitCode = 1
})
server.listen(8089, "127.0.0.1", () => {
  console.log(`Local preview: http://localhost:8089 (serving ${publicDirectory})`)
})
