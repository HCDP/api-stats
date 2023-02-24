function refresh() {
    console.log("refresh");
    getData();
}


function getData() {
    let div = document.getElementById("data");
    let url = "https://cistore.its.hawaii.edu:8443/apistats"

    fetch(url, {})
   .then((response) => {
       console.log(response);
       return response.json();
   })
   .then((json) =>  {
       console.log(json);
       div.innerHTML = json;
   });
}

function bytes2gb(bytes) {
    let gb = bytes / 1024 / 1024 / 1024;
    gb = Math.round(gb * 100) / 100;
    return `${gb}GB`;
}

window.addEventListener("load", (event) => {
    getData();
    for(i = 0; i < arrayLength; i++) {
        temp = document.createElement('div');
        temp.className = 'results';
        temp.innerHTML = arrayVariable[i];
        document.getElementsByTagName('body')[0].appendChild(temp);
    }
});
