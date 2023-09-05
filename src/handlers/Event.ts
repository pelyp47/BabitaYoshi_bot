import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")

    readdirSync(eventsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event = require(`${eventsDir}/${file}`).default
        if(Object.keys(event).includes('event')) {
            event = event.event
        }
        event.once ?
            client.once(event.name, (...args) => event.execute(...args))
            :
            client.on(event.name, (...args) => event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
    })
}
