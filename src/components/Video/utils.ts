
function checkIframeForError(iframeElement:any) {
    try {
        let iframeUrl = iframeElement.contentWindow.location.href;
        
        const hasChromeErrorPage = iframeUrl.startsWith('chrome-error://');
        if (hasChromeErrorPage) {
            return true;
        }
        
        return false;
    } catch (e) {
        return checkIframeContentDocument(iframeElement);
    }
}

function checkIframeContentDocument(iframeElement:any) {
    try {
        const iframeDoc = iframeElement.contentDocument;
        
        if (!iframeDoc) {
            return false
        };

        const html = iframeDoc.documentElement?.outerHTML || '';
        return html.includes('chromewebdata') || 
               html.includes('ERR_') ||
               html.includes('Сайт недоступен');
               
    } catch (e) {
        return true;
    }
}

export function detectIframeError(iframeElement: any, callback: any) {
    let loadFired = false;

    iframeElement.onload = function() {
        loadFired = true;

        setTimeout(() => {
            const hasError = checkIframeForError(iframeElement);
            if (hasError) {
                callback(true);
            } else {
                callback(false);
            }
        }, 100);
    };

    setTimeout(() => {
        if (!loadFired) {
            callback(true);
        }
    }, 5000);
}
