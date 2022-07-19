const { exec } = require('child_process');
const fs = require('fs');
const memory = require("./memory.js");
const distributor = require('./distributor.js');

const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
console.log(lines);
lines.forEach(function(sline){
    const line = sline.trim();
    if(line == ''){
        return;
    }
    var command = line.split(' ')[0];
    switch(command){
        case 'var':
            var arr = line.split(' ');
            var varname = arr[1];
            arr.shift();
            arr.shift();
            arr.shift();
            var value = arr.join(' ');
            var type = 'int';
            if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))){
                type = 'string';
                value = value.replace('"', '').replace('"', '').replace("'", '').replace("'", '');
                while(value.indexOf('\\n') != -1)
                    value = value.replace('\\n', '\n');
            } else if(value.startsWith('$')){
                memory.mem.forEach(function(rvar){
                    if(rvar[0] == command)
                        value = rvar[1];
                        type = 'var';
                });
            }
            if(type == 'int'){
                value = parseInt(value);
            }
            memory.mem.push([varname, value]);
            break;
        default:
            if(line.split(' ')[1] == '='){
                var found = false;
                var indxvar = 0;
                var indx = 0;
                memory.mem.forEach(function(rvar){
                    if(rvar[0] == command){
                        found = true;
                        indxvar = indx;
                    }
                    indx++;
                });
                if(!found){
                    console.error(`Var not found('${command}')`);
                    process.exit(1);
                }
                var arr = line.split(' ');
                arr.shift();
                arr.shift();
                var value = arr.join(' ');
                var type = 'int';
                if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))){
                    type = 'string';
                    value = value.replace('"', '').replace('"', '').replace("'", '').replace("'", '');
                    while(value.indexOf('\\n') != -1)
                        value = value.replace('\\n', '\n');
                } else if(value.startsWith('$')){
                    memory.mem.forEach(function(rvar){
                        if(rvar[0] == command)
                            value = rvar[1];
                            type = 'var';
                    });
                }
                if(type == 'int'){
                    value = parseInt(value);
                }
                memory.mem[indxvar][1] = value;
            } else if(line.split(' ')[1] == '+='){
                var found = false;
                var indxvar = 0;
                var indx = 0;
                memory.mem.forEach(function(rvar){
                    if(rvar[0] == command){
                        found = true;
                        indxvar = indx;
                    }
                    indx++;
                });
                if(!found){
                    console.error(`Var not found('${command}')`);
                    process.exit(1);
                }
                var arr = line.split(' ');
                arr.shift();
                arr.shift();
                var value = arr.join(' ');
                var type = 'int';
                if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))){
                    type = 'string';
                    value = value.replace('"', '').replace('"', '').replace("'", '').replace("'", '');
                    while(value.indexOf('\\n') != -1)
                        value = value.replace('\\n', '\n');
                } else if(value.startsWith('$')){
                    memory.mem.forEach(function(rvar){
                        if(rvar[0] == value.replace('$', ''))
                            value = rvar[1];
                            type = 'var';
                    });
                }
                if(type == 'int'){
                    value = parseInt(value);
                }
                memory.mem[indxvar][1] += value;
            } else if(line.split(' ')[1] == '-='){
                var found = false;
                var indxvar = 0;
                var indx = 0;
                memory.mem.forEach(function(rvar){
                    if(rvar[0] == command){
                        found = true;
                        indxvar = indx;
                    }
                    indx++;
                });
                if(!found){
                    console.error(`Var not found('${command}')`);
                    process.exit(1);
                }
                var arr = line.split(' ');
                arr.shift();
                arr.shift();
                var value = arr.join(' ');
                var type = 'int';
                if(value.startsWith('$')){
                    memory.mem.forEach(function(rvar){
                        if(rvar[0] == command)
                            value = rvar[1];
                            type = 'var';
                    });
                }
                if(type == 'int'){
                    value = parseInt(value);
                }
                memory.mem[indxvar][1] -= value;
            } else {
                var targs = line.split(' ');
                targs.shift();
                var chars = targs.join(' ').split('');
                chars.push(';');
                var args = [];
                var argtype = 'none';
                var word = '';
                var strchar = '"';
                chars.forEach(function(char){
                    if(char == '"' || char == "'"){
                        if(argtype == 'string' && strchar == char){
                            argtype = 'none';
                            return;
                        } else if(argtype != 'string') {
                            argtype = 'string';
                            strchar = char;
                            return;
                        }
                    } else if((char == ',' || char == ';') && argtype != 'string'){
                        args.push(word);
                        word = '';
                        return;
                    }
                    if(argtype != 'string' && char == ' ')
                        return;
                    word+=char;
                });
                for(var i=0; i<args.length; i++){
                    if(args[i].startsWith('$')){
                        var varname = args[i].replace('$', '');
                        var found = false;
                        memory.mem.forEach(function(rvar){
                            if(rvar[0] == varname)
                                args[i] = rvar[1];
                        });
                    } else if(args[i].startsWith('*')){
                        var varname = args[i].replace('*', '');
                        var found = false;
                        var ii=0;
                        memory.mem.forEach(function(rvar){
                            if(rvar[0] == varname)
                                args[i] = [rvar[1], ii];
                            ii++;
                        });
                    } else if(!isNaN(Number(args[i]))){
                        args[i] = parseInt(args[i]);
                    } else {
                        while(args[i].indexOf('\\n') != -1)
                            args[i] = args[i].replace('\\n', '\n');
                    }
                }
                distributor.check(command, args);
            }
            break;
    }
})