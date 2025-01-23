
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

const loadingDiv = document.createElement("div");
loadingDiv.className = "loader";

function refresh() {
    getData();
}

function bytes2gb(bytes) {
    let gb = bytes / 1024 / 1024 / 1024;
    gb = Math.round(gb * 100) / 100;
    let gbStr = gb.toLocaleString();
    return `${gbStr}GB`;
}

function handleRes(res) {
    const dataDiv = document.getElementById("data");
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
}

function handleError(msg) {
    console.error(msg);
    const dataDiv = document.getElementById("data");
    let errorBlock = document.createElement("div");
    errorBlock.className = "stat-block";
    let errorMessage = document.createElement("p");
    errorMessage.innerHTML = "An error occurred while getting the statistics.";
    errorBlock.appendChild(errorMessage);
    dataDiv.appendChild(errorBlock);
}

function getData() {
    const refreshButton = document.getElementById("refresh-button");
    const dataDiv = document.getElementById("data");
    while(dataDiv.firstChild) {
        dataDiv.removeChild(dataDiv.lastChild);
    }
    refreshButton.disabled = true;
    dataDiv.appendChild(loadingDiv);

    let url = "https://api.hcdp.ikewai.org/apistats"

    fetch(url, {})
    .then((res) => {
        let contentType = res.headers.get("content-type");
        let dataHandle;
        if(contentType && contentType.indexOf("application/json") >= 0) {
            dataHandle = res.json().then(handleRes);
        }
        else {
            dataHandle = res.text().then(handleError);
        }
        return dataHandle;
    }, (e) => {
        handleError(e);
    })
    .then(() => {
        refreshButton.disabled = false;
        dataDiv.removeChild(loadingDiv);
    });
}



window.addEventListener("load", (event) => {
    getData();
});
