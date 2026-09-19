// Local-only review. This command never publishes or changes source data.
import http from "node:http"
import { fileURLToPath } from "node:url"
import handler from "serve-handler"
const output = process.env.REVIEW_FINAL === '1' ? 'public-review-final' : 'public'
const port = process.env.REVIEW_FINAL === '1' ? 8099 : 8098
const publicDirectory = fileURLToPath(new URL(`../../${output}/`, import.meta.url))
http.createServer((request, response) => handler(request, response, {
  public: publicDirectory, cleanUrls: true, trailingSlash: false,
  headers: [{ source: "**/*", headers: [{ key: "Cache-Control", value: "no-store" }] }],
})).listen(port, "127.0.0.1", () => console.log(`Review only: http://127.0.0.1:${port}`))
