
var electronInstaller = require('electron-winstaller');


var settings = {
    
    appDirectory: './barcodeprint/barcodeprint-win32-x64',
    
    outputDirectory: './barcodeprintsetup',
    
    authors: 'Savas HASCELIK',
    
    exe: './barcodeprint.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});