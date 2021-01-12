const path = require('path');
const electron = require('electron');
const isDev = require('electron-is-dev');
const Datastore = require('nedb');

const {app, BrowserWindow, ipcMain} = electron;


if(require("electron-squirrel-startup")){app.quit();}

// TODO: Add error handling
const pool = new Datastore({filename: app.getAppPath() + '/pool.db', autoload: true});
const columns = new Datastore({filename: app.getAppPath() + '/columns.db', autoload: true})


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


/* Event handlers */

// Start event handler
ipcMain.on("render:started", (event) => {
    console.clear()
    console.log("[MAIN] : Recieved start message from render process")
    columns.find({}, (error, columns) => { 
        if (error) {
            event.sender.send('main:columns-return', null)
        } else if (columns.length == 0) {
            event.sender.send('main:columns-return', { columnsLength: 0, columns: columns })
        } else { 
            event.sender.send('main:columns-return', { columnsLength: columns.length, columns: columns })
        }
    })
})

// Column form submit event handler
ipcMain.on("columnForm:submit", (event, form) => { 
    console.log("[MAIN] : Received submit event from column form with data \n\t" + JSON.stringify(form))
    if (form) {
        // We're all good
        // TODO: Calculate values from data
        // TODO: Put column in database
        // TODO: Update ColumnsList in render process
        // TODO: Send success signal to render process
        event.sender.send("main:submitReceived",true)
    } else {
        // Error in the form data
        console.error("[MAIN] : Problem with submitted form \n\t" + JSON.stringify(form))
        event.sender.send("main:submitReceived",false)
    }
})