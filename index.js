const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const fs = require('fs'); // test
const xlsx = require('xlsx'); // test

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let loginWindow;
let mainWindow;

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,

    //============================
    //PARA PERSONALIZAR EN WINDOWS
    frame: false,
    //PARA PERSONALIZAR EN WINDOWS
    //===========================

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Ruta al archivo preload.js
    },
  });

  //loginWindow.webContents.openDevTools()
  loginWindow.loadFile(path.join(__dirname, 'login.html'));
  
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 800,
    show: false,

    //============================
    //PARA PERSONALIZAR EN WINDOWS
    frame: false,
    //PARA PERSONALIZAR EN WINDOWS
    //===========================


    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Ruta al archivo preload.js
    },
  });

  mainWindow.maximize();
  loginWindow.close();

  //mainWindow.webContents.openDevTools()
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
    ipcMain.on('open-main-window', () => {
        if (!mainWindow) {
          createMainWindow();
        }
      });
  ipcMain.on('validateLogin', (event, user, password) => {
    if (user === 'Colangio' && password === '1069') {
      loginWindow.webContents.send('loginResult', true);
    } else {
      loginWindow.webContents.send('loginResult', false);
    }
  });
  ipcMain.on('saveData', (event, data) => {
    try {
      const save = guardarDatos(data);
      event.reply('saveResult', save);
    } catch (error) {
      console.error('Error en el proceso principal:', error);
      
      mainWindow.webContents.executeJavaScript('alert("Error al guardar los datos.");');
    }
  });
  ipcMain.on('openExcel', openExcel)
  createLoginWindow()


  //============================
    //PARA PERSONALIZAR EN WINDOWS
  ipcMain.on('minimizar-login', () => {
    loginWindow.minimize();
  });

  ipcMain.on('cerrar-login', () => {
    loginWindow.close();
  });

  ipcMain.on('minimizar-main', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximizar-main', () => {
    mainWindow.maximize();
  });

  ipcMain.on('restaurar-main', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('cerrar-main', () => {
    mainWindow.close();
    app.quit();
  });
  //PARA PERSONALIZAR EN WINDOWS
  //===========================
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


function guardarDatos(data) {
  try {
    const filePath = path.join(__dirname, 'Pacientes.xlsx');
    const headers = [
    'Consecutivo', 'Iniciales', 'Sexo', 'Edad al diagnóstico', 'Afiliación al sistema de salud', 
    'Fecha de diagnóstico de cáncer del colangiocarcinoma', 'Histología', 'Grado de diferenciación', 'Localización del tumor', 
    'TNM', 'Estadío al diagnóstico', 'ECOG', 'CA 19-9', 'CEA', 'NGS', 'Resultado NGS', 'Cirugía', 'Fecha cx', 'Intención de la cx',
    'Terapia sistémica', 'Nombre terapia sistémica', 'Fecha de inicio terapia sistémica', 'Escenario', 'Respuesta', 'RxTx',
    'Radiocirugía', 'Progresión/Recaída', 'Fecha de la primera progresión/recaída', 'Primera línea', 'Nombre de la primera línea',
    'Segunda línea', 'Nombre de la segunda línea', 'Estado Vital', 'Fecha de último seguimiento', 'Fecha de muerte'
    ];

    let workbook;
    let worksheet;

    if (!fs.existsSync(filePath)) {
      // Si el archivo no existe, crea uno nuevo con encabezados
      workbook = xlsx.utils.book_new();
      worksheet = xlsx.utils.json_to_sheet([headers]);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
    } else {
      // Leer el archivo existente
      workbook = xlsx.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    }

    // Encontrar la última fila ocupada en la hoja de trabajo
    const lastRow = worksheet['!ref'] ? xlsx.utils.decode_range(worksheet['!ref']).e.r + 1 : 0;

    // Agregar una nueva fila con los datos del formulario
    const newRow = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], 
    data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21], data[22], data[23], data[24], 
    data[25], data[26], data[27], data[28], data[29], data[30], data[31], data[32], data[33], data[34], data[35]];

    // Convertir la fila de datos a un objeto con claves coincidentes con los encabezados
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = newRow[index];
    });

    // Agregar la fila de datos a la hoja de trabajo
    const newRowIndex = lastRow + 1;
    headers.forEach((header, index) => {
      const cellAddress = xlsx.utils.encode_cell({ c: index, r: newRowIndex });
      worksheet[cellAddress] = { t: 's', v: rowData[header] };
    });

    // Verificar si ya existe una fila con los mismos datos en la hoja de trabajo
    let existingRow = -1;
    const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: headers });
    sheetData.forEach((row, index) => {
      if (Object.keys(rowData).every(key => row[key] === rowData[key])) {
        existingRow = index;
        return false; // Salir del bucle si se encuentra una fila existente
      }
    });

    // Si no existe una fila igual, agregar la nueva fila
    if (existingRow === -1) {
      xlsx.utils.sheet_add_json(worksheet, [rowData], { skipHeader: true, origin: lastRow });
    }
    else {
    // Alertar al usuario de que la fila ya existe
    mainWindow.webContents.executeJavaScript('alert("Los datos no se pueden guardar porque el paciente ya existe.");');
    mainWindow.webContents.send('saveResult', false);
    return false
    }

    // Escribir de nuevo en el archivo
    fs.writeFileSync(filePath, xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' }));
    mainWindow.webContents.executeJavaScript('alert("Los datos se guardaron correctamente.");');
    mainWindow.webContents.send('saveResult', true);
    return true

  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: 'Error al guardar los datos' };
  }
}


function openExcel(){
  const filePath = path.join(__dirname, 'Pacientes.xlsx');
  shell.openPath(filePath);
}