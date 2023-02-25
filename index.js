
let labelMap = {
    downloads: "Number of Downloads",
    files_downloaded: "Number of Files Downloaded",
    files_processed: "Number of Files Processed",
    num_unique_emails: "Number of Unique Emails (Users)",
    requests: "Number of Requests to the API",
    bytes: "Gigabytes of Data Downloaded",
    coverage: "Coverage Dates"
};
displayOrder = ["coverage", "requests", "files_processed", "downloads", "files_downloaded", "bytes", "num_unique_emails"];

function refresh() {
    getData();
}

let loadingDiv = document.createElement("h2");
loadingDiv.innerHTML = "Loading...";
loadingDiv.className = "stat-block";

function bytes2gb(bytes) {
    let gb = bytes / 1024 / 1024 / 1024;
    gb = Math.round(gb * 100) / 100;
    let gbStr = gb.toLocaleString();
    return `${gbStr}GB`;
}

function getData() {
    let dataDiv = document.getElementById("data");
    while(dataDiv.firstChild) {
        dataDiv.removeChild(dataDiv.lastChild);
    }
    dataDiv.appendChild(loadingDiv);

    let url = "https://cistore.its.hawaii.edu:8443/apistats"

    setTimeout(() => {
        fetch(url, {})
        .then((response) => {
            return response.json();
        })
        .then((res) =>  {
            dataDiv.removeChild(loadingDiv);
            for(let item of res) {
                let statBlock = document.createElement("div");
                for(let tag of displayOrder) {
                    let value = item[tag];
                    if(value) {
                        let label = `${labelMap[tag]}:`;
                        let displayValue;
                        switch(tag) {
                            case "coverage": {
                                displayValue = `${value[0]} - ${value[1]}`;
                                break;
                            }
                            case "bytes": {
                                displayValue = bytes2gb(value);
                                break;
                            }
                            default: {
                                displayValue = value.toLocaleString();
                            }
                        }
                        let labelElement = document.createElement("h3");
                        labelElement.innerHTML = label;
                        let valueElement = document.createElement("p");
                        valueElement.innerHTML = displayValue;
                        statBlock.appendChild(labelElement);
                        statBlock.appendChild(valueElement);
                        statBlock.appendChild(document.createElement("br"));
                        statBlock.className = "stat-block";
                    }
                }
                dataDiv.appendChild(statBlock);
            }
        });
    }, 1000);
    
}



window.addEventListener("load", (event) => {
    getData();
});
