const path = require('path');
const electron = require('electron');
const isDev = require('electron-is-dev');
const Datastore = require('nedb');

const {app, BrowserWindow, ipcMain} = electron;


if(require("electron-squirrel-startup")){app.quit();}


const db = new Datastore({filename: 'pool.db', autoload: true});
db.loadDatabase();


let win;
function createWindow(){
    win = new BrowserWindow({
        width: 1080,
        height: 1920,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(
        isDev ? "http://localhost:8080" : `file://${path.join(__dirname,"../build/index.html")}`
    );

    /*
    if(isDev){
        win.webContents.openDevTools({mode: "detach"});
    }
    */
}

app.whenReady().then(createWindow);

app.on("window-all-closed",()=>{
    if(process.platform !== "darwin"){
        app.quit();                  
    }
})

app.on("activate",()=>{
    if(BrowserWindow.getAllWindows.length === 0){
        createWindow();
    }
})

//Start event handler
ipcMain.on("render:started",(event) => {
    console.log("[MAIN] : Recieved start message from render process")
    db.find({},(error, data) => {
        if(error){
            event.sender.send('main:pool-data-return', null)
        } else if(data.length == 0){
            event.sender.send('main:pool-data-return',{dataLength:0,dataItems:data})
        } else {
            event.sender.send('main:pool-data-return',{dataLength:data.length,dataItems:data})
        }
    })
})