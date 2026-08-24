import {
    readdirSync,
    readFileSync,
    writeFileSync
} from "fs"

import {
    join as pathJoin,
    extname
} from "path"


const DIRECTORY = "./recipes"

const files = readdirSync(DIRECTORY)
    .filter(file => extname(file) === ".json")
    .sort()

const index = []


if (files.length === 0)
    throw new Error("No recipes found")


files.forEach(file => {
    const filePath = pathJoin(DIRECTORY, file)

    const data = readFileSync(filePath, {
        encoding: "utf-8"
    })

    const content = parseJSON(data, file)


    index.push({
        name: content.name,
        id: content.id,
        totalTime:
            (content.prepTime ?? 0) +
            (content.cookTime ?? 0),
        serveWith: content.serveWith
    })
})


index.sort((a, b) =>
    a.name.localeCompare(b.name, "fr")
)


writeFileSync(
    "index.json",
    JSON.stringify(index, null, 4) + "\n"
)


console.log(`✓ Built ${files.length} recipes`)


function parseJSON(value, file) {
    try {
        return JSON.parse(value)
    } catch {
        throw new Error(`${file}: invalid JSON format`)
    }
}
