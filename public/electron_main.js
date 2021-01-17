const path = require('path');
const electron = require('electron');
const isDev = require('electron-is-dev');
const Datastore = require('nedb');
const { log } = require('console');
const { type } = require('os');

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
    console.log("[MAIN] : Recieved start message from render process - asking for columns")
    columns.find({}, (error, columns) => { 
        if (error) {
            event.sender.send('main:columns-return', null)
        } else if (columns.length == 0) {
            event.sender.send('main:columns-return', { columnsLength: 0, columnsList: columns })
        } else { 
            event.sender.send('main:columns-return', { columnsLength: columns.length, columnsList: columns })
        }
    })
})

// Column form submit event handler
ipcMain.on("columnForm:submit", (event, form) => { 
    console.log("[MAIN] : Received submit event from column form with data \t" + form.name)
    var xyMap = []
    if (form) {
        form.normalisation_rules.filter(rule => {
            return rule.function === "custom"
        }).forEach(rule => {
            rule.start = parseFloat(rule.start)
            rule.end = parseFloat(rule.end)
            rule.n_start = parseFloat(rule.n_start)
            rule.n_end = parseFloat(rule.n_end)

            var newControl = { x: null, y: null }
            
            var x_frac =  (rule.end - rule.start) / (rule.curveParams.end[0] - rule.curveParams.start[0])
            newControl.x = ((rule.curveParams.control[0] - rule.curveParams.start[0]) * x_frac) + rule.start

            var y_frac =  (rule.n_end - rule.n_start) / (rule.curveParams.end[1] - rule.curveParams.start[1])
            newControl.y = ((rule.curveParams.control[1] - rule.curveParams.start[1]) * y_frac) + rule.n_start

            resolution = (Math.abs(rule.end - rule.start) >= Math.abs(rule.n_end - rule.n_start)) ? Math.abs(rule.end - rule.start) * 1000 : Math.abs(rule.n_end - rule.n_start) * 1000
            var i = 0
            for (; i <= 1; i += (1 / resolution)) {
                xyMap.push(getBezierCoords(i, rule.start, rule.n_start, rule.end, rule.n_end, newControl))
            }
            xyMap.push(getBezierCoords(1, rule.start, rule.n_start, rule.end, rule.n_end, newControl))
            rule.curveParams = xyMap
        });

        // Adding to columns database
        columns.insert({
            name: form.name,
            type: form.type,
            isCore: (form.isCore === "isCore") ? true : false,
            isNormalise: (form.isNormalise === "isNormalise") ? true : false,
            weight: form.weight,
            normalisation_rules: (form.isNormalise === "isNormalise") ? form.normalisation_rules : undefined
        }, (err, inserted) => { 
            if (err) {
                console.error("[MAIN] : Error inserting record into database")
            } else {
                console.log("[MAIN] : Inserted column into database : " + inserted._id.toString())
                event.sender.send("main:submitReceived",true)
            }
        })

    } else {
        // Error in the form data
        console.error("[MAIN] : Problem with submitted form \n\t" + JSON.stringify(form))
        event.sender.send("main:submitReceived",false)
    }
})


// Util functions
function getBezierCoords(t, Ax, Ay, Bx, By, controlPoint) { 
    return {
        x: ((1-t) * (1-t) * Ax) + (2 * (1-t) * t * controlPoint.x) + (t * t * Bx),
        y: ((1-t) * (1-t) * Ay) + (2 * (1-t) * t * controlPoint.y) + (t * t * By)
    }
} 