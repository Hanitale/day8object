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
function showFileSystem(x){
    console.log(x.name+'/');
    var i;
    if (x.children && x.children.length> 0 ){
        for (i=0;i<x.children.length;i++){
            if(x.children[i].type == 'folder') {
                console.log('\t' + x.children[i].name +'/');
            } else {
                console.log('\t#' + x.children[i].name);
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

function moveTo(x){
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

function findParent(x,y) {       //looking for me, current, and then i know my father
    for (var i = 0; i < x.children.length; i++) {
        if (x.children[i] == y) {
                return x;
        }
    }

        if ((x.children) && x.children[i].type == 'folder'){
             currentFolder = findParent(x.children, y);
        }

}

function findInChildren(x, y){
    if (x.children && x.children.length > 0) {
        for (var i = 0; i < x.children.length; i++) {
            if (x.children[i].name == y) {
               currentFolder = x.children[i];
               return i;
            }
        }
    }
    return false;
}

function createNew(x){
    var newItem = readlineSync.question('Enter name of File or Folder to add?\n');
    var ifExists = findInChildren(x, newItem);
    if(ifExists == false){
        nextId++;
        var itemContent = readlineSync.question('Enter text if file\n');
        if (itemContent < 1) {
            x.children.push({type: 'folder', id: nextId, name: newItem, children: []});
        } else {
            x.children.push({type: 'file', id: nextId, name: newItem, content: itemContent});
        }
        showFileSystem(x);
        return;

    } else {
        console.log('Sorry this name is taken');
      }
}


function deleteItem(x){
    var itemToDelete = readlineSync.question('Enter name of item to delete\n');
    var index = findInChildren(x, itemToDelete);
    if(index == false){
        console.log('No Such File');
    } else {
        areYouSure = readlineSync.question('Are you sure? y/n\n');
        if (areYouSure == 'n') {
            console.log('action cancelled');
        } else {
            x.children.splice(index, 1);                //deletes the item in index location
            // for (u = currentFolder.index; u < (fsStorage.length); u++) {     //updates array to avoid hole
            //     fsStorage[u][0] = u;
            //     if (fsStorage[u][1] != 0) {
            //         fsStorage[u][1] = (fsStorage[u][1]) - 1;
            //     }
            // }
        }
        console.log(itemToDelete, "has been deleted");
        currentFolder = x;
        showFileSystem(currentFolder);
    }
}

function openFile(x) {
    var fileName = readlineSync.question('Enter name of File to open\n');
    var index = findInChildren(x, fileName);
    if(typeof (index)== 'number') {
        console.log(x.children[index].content);
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
