import { Command } from "../../../lib/exec/Command";
import { Client } from "../../../lib/types";
import { Message } from "discord.js";
import Set from "./set";
import Delete from "./delete";;
import config from "../../../config";

export default class Prefix extends Command {
    constructor() {
        super(
            "prefix",
            "Sets the guild-specific prefix.",
            [
                {
                    name: "command",
                    description: "Command of prefix to execute",
                    required: false,
                    type: "string",
                    options: ["set", "delete"]
                },
                {
                    name: "new prefix",
                    description: "Your new prefix",
                    required: false,
                    type: "string",
                }
            ],
            undefined,
            ["ADMINISTRATOR"],
            ["text"],
            undefined,
            {
                set: new Set(),
                delete: new Delete()
            }
        );
    }

    async run(client: Client, msg: Message): Promise<boolean> {
        let args: any = await this.parseArgs(msg);

        if (args[0]) {
            if (!this.subCommands[args[0]]) {
                return await this.fail(msg, `Invalid subcommand. Type \`${await this.getPrefix(msg)}help prefix\` to learn more.`);
            }

            return await this.runSub(args[0], client, msg);
        } else {
            const server = await client.serverManager.getServer(msg.guild.id);
            let prefix = server.getPrefixFromGuild(msg.guild.id);
            if (!prefix) prefix = config.PREFIX;

            await this.respond(msg, `The guild prefix is: \`${prefix}\``)
            return true;
        }
    }
}