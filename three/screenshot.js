
function dataURIToBlob(dataURI) {
    const binStr = window.atob(dataURI.split(",")[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new window.Blob([arr]);
  }
  
  function saveDataURI(name, dataURI) {
    const blob = dataURIToBlob(dataURI);
  
    // force download
    const link = document.createElement("a");
    link.download = name;
    link.href = window.URL.createObjectURL(blob);
    link.onclick = () => {
      window.setTimeout(() => {
        window.URL.revokeObjectURL(blob);
        link.removeAttribute("href");
      }, 500);
    };
    link.click();
  }
  
  function defaultFileName(ext) {
    const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
    return str.replace(/\//g, "-").replace(/:/g, ".");
  }
  export { saveDataURI, defaultFileName };