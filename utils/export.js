const exportToCsv = (words) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Front,Back\n"; // Assuming 'Front' is the word and 'Back' is the meaning

    words.forEach(word => {
        let row = `${word.word},${word.meaning}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "anki_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default exportToCsv;