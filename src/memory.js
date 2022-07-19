var mem = [['curdir', process.cwd()]];
function setvar(id, value){
    mem[id][1] = value;
}
module.exports = {mem,setvar};