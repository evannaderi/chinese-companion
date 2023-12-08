function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error(`Error loading script "${src}"`));
        document.body.appendChild(script);
    });
}

const loadJieba = async () => {
    // Load Jieba and its dependencies
    const jqueryLoaded = await loadScript("https://pulipulichen.github.io/jieba-js/jquery.js");
    if (!jqueryLoaded) {
        throw new Error('Jieba dependency (jQuery) failed to load');
    }
    const jiebaLoaded = await loadScript("https://pulipulichen.github.io/jieba-js/require-jieba-js.js");
    if (!jiebaLoaded) {
        throw new Error('Jieba failed to load');
    }
}

export const segmentTextJieba = async (text) => {
    await loadJieba(); // Ensure Jieba is loaded before trying to use it

    return new Promise((resolve, reject) => {
        if (window.call_jieba_cut) {
            window.call_jieba_cut(text, (result) => {
                if (result) {
                    resolve(result); // Resolve with the segmented text
                } else {
                    reject(new Error('Jieba segmentation failed'));
                }
            });
        } else {
            reject(new Error('Jieba is not initialized'));
        }
    });
}