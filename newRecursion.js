var readlineSync = require('readline-sync');
var menu = [
    'Show current folder',
    'Go to another folder and show contents',//move to another folder
    'Create file or folder',
    'Delete file or folder',
    'Open file',
    'Quit program'
];
var fs = [{
    type: 'folder', id: 0, name: 'root', children: [{
        type: 'folder', id: 1, name: 'sub1', children: [{type: 'file', id: 4, name: 'file1.txt'}]
    },
        {type: 'folder', id: 2, name: 'sub2', children: []},
        {type: 'file', id: 3, name: 'file1.txt', content: '"Not much to say"'}
    ]
}];
var fileSystem = fs[0];
var currentFolder = fileSystem;
var nextId = 5;
function readMenu() {
    var answer = readlineSync.keyInSelect(menu, 'choose from menu\n');
    switch (answer) {
        case 0:
            showFileSystem(currentFolder);
            break;
        case 1:
            moveTo(currentFolder);
            break;
        case 2:
            createNew(currentFolder);
            break;
        case 3:
            deleteItem(currentFolder);
            break;
        case 4:
            openFile(currentFolder);
            break;
        case 5:
            quitProgram();
            break;
        }
}
function showFileSystem(currentFolder){
    console.log(currentFolder.name+'/');
    var i;
    if (currentFolder.children && currentFolder.children.length> 0 ){
        for (i=0;i<currentFolder.children.length;i++){
            if(currentFolder.children[i].type == 'folder') {
                console.log('\t' + currentFolder.children[i].name +'/');
            } else {
                console.log('\t#' + currentFolder.children[i].name);
            }
        }
    }
    //findIf(x);                 //code for real reacursion all the way
    // if (x.type == 'folder'){
    //     for (i=0;i<x.children.length;i++){
    //         printZe(x.children[i]);
    //     }
    // }
}

function moveTo(){
    var answer = readlineSync.question('Enter name of Folder to go to?\n');
    if (answer == '..') {
        if(currentFolder == fileSystem){
           console.log('There is no higher than Root Directory');
        } else {
        currentFolder = findParent(fileSystem, currentFolder);
          }
    } else {
        var validate = findInChildren(currentFolder, answer);
        if(typeof(validate)!= 'number'){
            console.log('No Such Folder');
        }
    }
    showFileSystem(currentFolder)
}

function findParent(fs) {       //looking for me, current, and then i know my father
    for (var i = 0; i < fs.children.length; i++) {
        if (fs.children[i] == currentFolder) {
                return fs;
        }
    }

        if ((fs.children) && fs.children[i].type == 'folder'){
             currentFolder = findParent(fs.children, currentFolder);
        }

}

function findInChildren(fs, itemName){
    if (fs.children && fs.children.length > 0) {
        for (var i = 0; i < fs.children.length; i++) {
            if (fs.children[i].name == itemName) {
               currentFolder = fs.children[i];
               return i;
            }
        }
    }
    return false;
}

function createNew(fs){
    var newItem = readlineSync.question('Enter name of File or Folder to add?\n');
    var ifExists = findInChildren(fs, newItem);
    if(ifExists == false){
        nextId++;
        var itemContent = readlineSync.question('Enter text if file\n');
        if (itemContent < 1) {
            fs.children.push({type: 'folder', id: nextId, name: newItem, children: []});
        } else {
            fs.children.push({type: 'file', id: nextId, name: newItem, content: itemContent});
        }
        showFileSystem(fs);
        return;

    } else {
        console.log('Sorry this name is taken');
      }
}


function deleteItem(fs){
    var itemToDelete = readlineSync.question('Enter name of item to delete\n');
    var index = findInChildren(fs, itemToDelete);
    if(typeof (index) != 'number'){
        console.log('No Such File');
    } else {
        areYouSure = readlineSync.question('Are you sure? y/n\n');
        if (areYouSure == 'n') {
            console.log('action cancelled');
        } else {
            fs.children.splice(index, 1);                //deletes the item in index location
            // for (u = currentFolder.index; u < (fs.length); u++) {     //updates array to avoid hole
            //     fs[u][0] = u;
            //     if (fs[u][1] != 0) {
            //         fs[u][1] = (fs[u][1]) - 1;
            //     }
            // }
        }
        console.log(itemToDelete, "has been deleted");
        currentFolder = fs;
        showFileSystem(currentFolder);
    }
}

function openFile(fs) {
    var fileName = readlineSync.question('Enter name of File to open\n');
    var index = findInChildren(fs, fileName);
    if(typeof (index)== 'number') {
        console.log(fs.children[index].content);
    } else {
        console.log('No Such File');
    }
}

function quitProgram() {
    process.exit(0);
}


while (true) {
    //showFolder(currentId);
    readMenu();
}
