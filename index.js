/* customDefs structure
{
    OPCODE_NAME : {
        protocolVersion : opcodeNumber
    }
}
*/
var customDefs = {
    "TTB_C_REQUEST_USER_DECK": {
        "378037": 55579,
        "378447" : 55579
    }
}
var defAvailable = false;
var savedUsers = [];
class Briscola
{
    constructor(mod)
    {
        mod.dispatch.addDefinition('TTB_C_REQUEST_USER_DECK', 99,
            [
                ['gameId', 'int64'],
            ]
        );

        if (customDefs["TTB_C_REQUEST_USER_DECK"][mod.dispatch.protocolVersion] !== undefined)
        {
            mod.dispatch.addOpcode("TTB_C_REQUEST_USER_DECK", customDefs["TTB_C_REQUEST_USER_DECK"][mod.dispatch.protocolVersion]);
            defAvailable = true;
        }

        if (!defAvailable)
        {
            mod.command.message("<font color='#ff5555'>Missing opcode for current protocol.</font>");
            return;
        }


        mod.hook("S_USER_PAPERDOLL_INFO", 11, ev =>
        {
            const idx = savedUsers.findIndex(x => x.name.toLowerCase() === ev.name.toLowerCase());
            if (idx < 0)
            {
                savedUsers.push(ev);
            }
            else
            {
                savedUsers[idx] = ev;
            }
        });

        mod.hook("S_SPAWN_USER", 17, ev =>
        {
            const idx = savedUsers.findIndex(x => x.name.toLowerCase() === ev.name.toLowerCase());
            if (idx < 0)
            {
                savedUsers.push(ev);
            }
            else
            {
                savedUsers[idx] = ev;
            }
        });

        mod.command.add("briscola", (name) =>
        {
            const foundUser = savedUsers.find(user => user.name.toLowerCase() === name.toLowerCase());
            if (!foundUser)
            {
                mod.command.message("<font color='#ff5555'>User not found, inspect it first or have it in range!</font>");
            }
            else
            {
                mod.send("TTB_C_REQUEST_USER_DECK", 99, { gameId: foundUser.gameId });
            }
        });
    }
}

module.exports = Briscola;
