const downloadJson = (jsonData: JSON) => {
    const jsonString = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
};

export default downloadJson;
