var blockb=[[2500],[0]];
var blockw=[[2500],[0]];
var blockf=[[2500],[0]];

var processIdArr = [];
var nextId = 1;


var flag;
var next;
var del;
var flagb,flagw,flagf;
var timer;

initContent();

function showBlock(name, block)
{
    var context=document.getElementById(name).getContext('2d');
    var sum = 0;
    for(var i=0; i < block[0].length; i++)
    {
        var r = block[0][i] / 2;
        context.fillStyle = block[1][i] == 0 ? 'yellow' : 'red';
        context.fillRect(sum, 0, r, 100);
        context.strokeStyle = 'black';
        context.strokeRect(sum, 0, r, 100);
        context.fillStyle = 'black';
        context.font = '15pt Calibri';
        context.textAlign = 'center';
        if (block[1][i] == 0) {
            context.fillText(r * 2 + 'KB', sum + r / 2, 50);
        } else {
            context.fillText(r * 2 + 'KB', sum + r / 2, 60);
            context.fillText( 'ID:' + block[1][i], sum+r/2, 30);
        }
        sum += r;
    }
}

function add(val)
{
    flagb = 0;
    var min = 2500;
    var index = -1;
    var i;
    for(i=0; i<blockb[0].length; i++)
    {
        if(blockb[0][i] >= val && blockb[0][i] <= min && blockb[1][i] == 0) {
            min = blockb[0][i];
            index = i;
        }
    }
    if(index > -1)
    {
        flagb = 1;
        if (min == val) {
            blockb[1][index] = 1;
        } else {
            blockb[0].splice(index, 1, val, blockb[0][index] - val);
            blockb[1].splice(index, 0, nextId);
        }
    }


    flagw = 0;
    var max = 0;
    index = -1;
    for(i=0; i<blockw[0].length; i++)
    {
        if (blockw[0][i] >= val && blockw[0][i] > max && blockw[1][i] == 0) {
            max = blockw[0][i];
            index = i;
        }
    }
    if(index > -1)
    {
        flagw = 1;
        if (max == val) {
            blockw[1][index] = 1;
        } else {
            blockw[0].splice(index, 1, val, blockw[0][index] - val);
            blockw[1].splice(index, 0, nextId);
        }
    }

    flagf = 0;
    for(i=0; i<blockf[0].length; i++)
    {
        if(blockf[0][i] >= val && blockf[1][i]==0)
        {
            flagf = 1;
            if (blockf[0][i] == val) {
                blockf[1][i] = 1;
            } else {
                blockf[0].splice(i, 1, val, blockf[0][i]-val);
                blockf[1].splice(i, 0, nextId);
            }
            break;
        }
    }

    processIdArr.push(nextId++);

    var messageArr = [];
    if(flagb == 0) messageArr.push("Best fit");
    if(flagw == 0) messageArr.push("Worst fit");
    if(flagf == 0) messageArr.push("First fit");
    if(messageArr.length > 0)
        alert(messageArr.join(" , ") + (messageArr.length > 1 ? " have " : " has ") +
                    "no more block for this process. Please kick 'clear' and restart.");
}



function sub(val)
{
    var processToDelete = blockb[1].indexOf(val);
    remove(processToDelete, blockb);

    processToDelete = blockw[1].indexOf(val);
    remove(processToDelete, blockw);

    processToDelete = blockf[1].indexOf(val);
    remove(processToDelete, blockf);

    var index = processIdArr.indexOf(val);
    processIdArr.splice(index, 1);
}

function remove(processToDelete, block)
{
    var total = 0;

    if(processToDelete > 0 && processToDelete < block[0].length - 1
        && block[1][processToDelete-1]==0 && block[1][processToDelete+1]==0)
    {
        total = block[0][processToDelete-1] + block[0][processToDelete] + block[0][processToDelete+1];
        block[0].splice(processToDelete-1, 3, total);
        block[1].splice(processToDelete, 2);
    }
    else if(processToDelete > 0 && block[1][processToDelete-1]==0
        && (processToDelete >= block[0].length -1 || block[1][processToDelete+1]!=0))
    {
        total = block[0][processToDelete-1] + block[0][processToDelete];
        block[0].splice(processToDelete-1, 2, total);
        block[1].splice(processToDelete,1);
    }
    else if( (processToDelete == 0 || block[1][processToDelete-1]!=0 )
        && processToDelete < block[0].length - 1 && block[1][processToDelete+1]==0)
    {
        total = block[0][processToDelete] + block[0][processToDelete+1];
        block[0].splice(processToDelete, 2, total);
        block[1].splice(processToDelete,1);
    }
    else
    {
        block[1][processToDelete] = 0;
    }
}

function stepOver()
{
    if(flag >= 2)
        sub(del);
    else
        add(next);

    showBlock("bestFit",blockb);
    showBlock("worstFit",blockw);
    showBlock("firstFit",blockf);

    flag = Math.floor(Math.random()*4);
    if(flag >=2 && processIdArr.length > 3)
    {
        del = processIdArr[Math.floor(Math.random()*processIdArr.length)];
    }
    else
    {
        flag = 1;
        next=Math.floor(Math.random()*400);
        if(next<150)
            next += 150;
    }
    mmsg();
}

function initContent()
{
    blockb = [[2500],[0]];
    blockw = [[2500],[0]];
    blockf = [[2500],[0]];

    nextId = 1;
    processIdArr = [];
    flag = 1;

    next=Math.floor(Math.random()*400);
    if(next<150)
        next += 150;

    showBlock("bestFit",blockb);
    showBlock("worstFit",blockw);
    showBlock("firstFit",blockf);
    mmsg();
}

function mmsg()
{
    var mycontext7=document.getElementById("main");
    if(flag >=2)
        mycontext7.innerHTML = 'Next: Delete ID' + del ;
    else
        mycontext7.innerHTML = 'Next: Add ' + next + 'KB';
}

function startStimulation()
{
    stepOver();
    if(flagb==1 && flagw==1 && flagf==1)
        timer = setTimeout("startStimulation()",1000);
}

function stopStimulation()
{
    clearTimeout(timer);
}

//function debugLog()
//{
//    var mycontext8=document.getElementById("test").getContext('2d');
//    mycontext8.fillStyle='white';
//    mycontext8.fillRect(0,0, 1250, 100);
//    mycontext8.fillStyle='black';
//    mycontext8.font = '15pt Calibri';
//    mycontext8.fillText(processIdArr, 50, 30);
//    mycontext8.fillText(nextId, 50, 70);
//    mycontext8.fillText(flag, 150, 70);
//    mycontext8.fillText(blockb[0], 150, 30);
//    mycontext8.fillText(blockb[1], 50, 30);
//    mycontext8.fillText(blockw[0].length, 250, 30);
//    mycontext8.fillText(blockw[1], 50, 50);
//    mycontext8.fillText(blockf[0].length, 450, 30);
//    mycontext8.fillText(blockf[1], 50, 70);
//}