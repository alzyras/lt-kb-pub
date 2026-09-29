import assert from "node:assert/strict"
import test from "node:test"
import { generateRobotsTxt } from "./robots"

test("robots.txt explicitly allows search and ChatGPT search crawlers and names the sitemap", () => {
  const robots = generateRobotsTxt("lietuvosistorija.eu")
  assert.match(robots, /User-agent: \*\nAllow: \/\n/)
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \/\n/)
  assert.match(robots, /Sitemap: https:\/\/lietuvosistorija\.eu\/sitemap\.xml/)
})
