const prompt = require('prompt-sync')();
const memory = require('./memory.js');
const fs = require('fs');

function get(rvar, pointer=false){
    if(typeof(rvar) == "object"){
        if(pointer)
            return rvar[1];
        return rvar[0];
    }
    return rvar;
}
function error(log){
    console.error(log);
    process.exit();
}

function check(command, args){
    switch(command){
        case 'print':
            args.forEach(function(arg){
                process.stdout.write(get(arg).toString());
            });
            break;
        case 'input':
            const input = prompt(get(args[1]));
            memory.setvar(get(args[0], true), input);
            break;
        case 'exit':
            if(typeof(args[0]) == 'number')
                process.exit(get(args[0]));
            else
                error('The error code is wrong!');
            break;
        case 'stdoutWrite':
            args.forEach(function(arg){
                process.stdout.write(arg);
            });
            break;
        case 'write':
            console.log(args);
            fs.writeFileSync(get(args[0]), get(args[1]), get(args[2]));
            break;
        default:
            error(`Command '${command}' not found`);
            break;
    }
}
module.exports={check};