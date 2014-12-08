var blockb, blockw, blockf;
var processIdArr, nextProcessId;

var choice, nextSize, deleteId;
var flagb, flagw, flagf;
var timer;

initContent();

function initContent()
{
    blockb = [[2500],[0]];
    blockw = [[2500],[0]];
    blockf = [[2500],[0]];

    processIdArr = [];
    nextProcessId = 1;

    flagb = 1;
    flagw = 1;
    flagf = 1;

    enableButton();
    showAllBlocks();
    prepareNext();
}

function stepOver()
{
    if (choice < 2) addProcess(nextSize);
    else removeProcess(deleteId);

    showAllBlocks();
    prepareNext();
}

function prepareNext()
{
    choice =  Math.floor(Math.random() * 4);
    if (choice >= 2 && processIdArr.length > 3) {
        deleteId = processIdArr[Math.floor(Math.random() * processIdArr.length)];
    } else {
        choice = 1;
        nextSize = Math.floor(Math.random() * 400);
        if (nextSize < 150) nextSize += 150;
    }
    showMessage();
}
function disableButton()
{
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = true;
    document.getElementById("next").disabled = true;
}

function enableButton()
{
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = false;
    document.getElementById("next").disabled = false;
}

function showAllBlocks()
{
    showBlock("bestFit", blockb);
    showBlock("worstFit", blockw);
    showBlock("firstFit", blockf);
}

function showBlock(name, block)
{
    var context = document.getElementById(name).getContext('2d');
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
            context.fillText( 'ID:' + block[1][i], sum+r/2, 30);
            context.fillText(r * 2 + 'KB', sum + r / 2, 60);
        }
        sum += r;
    }
}

function addProcess(size)
{
    flagb = 0;
    var min = 2500;
    var messageArr = [];
    var index = -1;
    var i;
    for(i=0; i<blockb[0].length; i++)
    {
        if(blockb[0][i] >= size && blockb[0][i] <= min && blockb[1][i] == 0) {
            min = blockb[0][i];
            index = i;
        }
    }
    if(index > -1) {
        flagb = 1;
        addProcessToBlock(blockb, index, min, size);
    } else {
        messageArr.push("Best fit");
    }


    flagw = 0;
    var max = 0;
    index = -1;
    for(i=0; i<blockw[0].length; i++)
    {
        if (blockw[0][i] >= size && blockw[0][i] > max && blockw[1][i] == 0) {
            max = blockw[0][i];
            index = i;
        }
    }
    if(index > -1) {
        flagw = 1;
        addProcessToBlock(blockw, index, max, size);
    } else {
        messageArr.push("Worst fit");
    }

    flagf = 0;
    for(i=0; i<blockf[0].length; i++)
    {
        if(blockf[0][i] >= size && blockf[1][i] == 0)
        {
            flagf = 1;
            addProcessToBlock(blockf, i, blockf[0][i], size);
            break;
        }
    }
    if(flagf == 0) messageArr.push("First fit");

    if(messageArr.length > 0) {
        alert(messageArr.join(" , ") + (messageArr.length > 1 ? " have " : " has ") +
                    "no more block for this process. Please kick 'clear' and restart.");
        stopStimulation();
        disableButton();
    } else {
        processIdArr.push(nextProcessId++);
    }
}

function addProcessToBlock(block, index, blockSize, processSize)
{
    if (blockSize == processSize) {
        block[1][index] = nextProcessId;
    } else {
        block[0].splice(index, 1, processSize, blockSize - processSize);
        block[1].splice(index, 0, nextProcessId);
    }
}

function removeProcess(processId)
{
    var process = blockb[1].indexOf(processId);
    deleteProcessAtBlock(blockb, process);

    process = blockw[1].indexOf(processId);
    deleteProcessAtBlock(blockw, process);

    process = blockf[1].indexOf(processId);
    deleteProcessAtBlock(blockf, process);

    var index = processIdArr.indexOf(processId);
    processIdArr.splice(index, 1);
}

function deleteProcessAtBlock(block ,process)
{
    var total = 0;

    if(process > 0 && process < block[0].length - 1
        && block[1][process-1]==0 && block[1][process+1]==0)
    {
        total = block[0][process-1] + block[0][process] + block[0][process+1];
        block[0].splice(process-1, 3, total);
        block[1].splice(process, 2);
    }
    else if(process > 0 && block[1][process-1]==0
        && (process >= block[0].length -1 || block[1][process+1]!=0))
    {
        total = block[0][process-1] + block[0][process];
        block[0].splice(process-1, 2, total);
        block[1].splice(process,1);
    }
    else if( (process == 0 || block[1][process-1]!=0 )
        && process < block[0].length - 1 && block[1][process+1]==0)
    {
        total = block[0][process] + block[0][process+1];
        block[0].splice(process, 2, total);
        block[1].splice(process,1);
    }
    else
    {
        block[1][process] = 0;
    }
}

function showMessage()
{
    var message = document.getElementById("message");
    if(flagb == 0 || flagw == 0 || flagf == 0) {
        message.innerHTML = 'Stimulation End.';
    } else if(choice >=2) {
        message.innerHTML = 'Next: Delete ID' + deleteId;
    } else {
        message.innerHTML = 'Next: Add ' + nextSize + 'KB';
    }
}

function startStimulation()
{
    stepOver();
    timer = setInterval("stepOver()", 1000);
}

function stopStimulation()
{
    clearInterval(timer);
    showMessage();
}