document.querySelector("#webBut").addEventListener("click", (e) => {
    window.location.href = "/"
})

document.querySelector("#close").addEventListener("click", (e) => {
    document.querySelector("#addDiv").style.display = "none"
    document.querySelector("#addDiv").reset()
    document.querySelector('#addError').innerHTML = ""
    document.querySelector("#addDiv").style.height = "190px"
})

document.querySelector(".addPlant").addEventListener("click", (e) => {
    document.querySelector("#addDiv").style.display = ""
    // document.querySelector(".addPlant").style.display = "none"
})

document.querySelector("#addDiv").addEventListener("submit", (e) => {
    e.preventDefault()

    const sub = e.srcElement
    const plant = {
        plantname: sub[0].value,
        planttype: sub[1].value,
        id: sub[2].value,
        pass: sub[3].value
        // deviceId: sub[2].value,
        // devicePass: sub[3].value
    }


    fetch(`/add/plant/${getCookie("username")}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: getCookie('token'),
            plant: plant
        })
    })
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        if (json.message == "Plant added") {
            addPlantDIV(plant)
            document.querySelector('#addError').innerHTML = ""
            document.querySelector("#addDiv").style.height = "190px"
            e.srcElement.reset()
        } else {
            document.querySelector("#addDiv").style.height = "230px"
            document.querySelector('#addError').innerHTML = json.message
        }
    })

    // document.querySelector("#addDiv").style.display = "none"
})

async function addPlantDIV(plant) {
    console.log(plant)
    const div = document.createElement('div')
    div.className='plant'
    div.name = plant.plantname

    const front = document.createElement('div')
    front.className = 'front'

    const frontHTML = `
    <img src="/images/${plant.planttype}.png">

    <b>${plant.plantname} (${plant.planttype})</b>
    <a id="health" class="good">Healthy</a>
    `
    front.innerHTML = frontHTML

    const buttons = document.createElement('div')
    buttons.className = 'twoCol'
    buttons.innerHTML = `
    <button class="details">Details</button>
    <button class="delete">Delete</button>
    `

    div.appendChild(front)
    div.appendChild(buttons)

    buttons.querySelector(".details").addEventListener("click", (e) => {

        fetch(`/get/plant/${getCookie("username")}/${plant.id}`,{
            method: 'GET',
            headers: {
                token: getCookie("token")
            }
        })
        .then(res => {return res.json()})
        .then((json) => {
            if (json.message != undefined) {
                
            } else {
                const plantDIV = e.target.parentElement.parentElement
                const siblings = getSiblings(plantDIV)

                siblings.forEach(sibling => sibling.style.display = "none")
                plantDIV.style.width = 'calc(100vw - 25px)'


                const latest = json

                let path = `M0 100`
                Object.keys(latest.light).forEach((key) => {
                    let normalised = latest.light[key] / 3000
                    if (normalised > 1) normalised = 1
                    path += ` L${(key-450)*(250/200)} ${100-(normalised*100)*1}`
                })
                path += ` L250 100 Z`

                front.className = "back"
                front.innerHTML = `
                <b>${plant.plantname} (${plant.planttype})</b>
                <div class="data">
                    <div class="twoCol">
                        <b class="entry" id ="temp">Temperature: <span class="${latest.processed.temperature}">${latest.temperature}℃</span></b>
                        <b class="entry" id ="humidity">Humidity: <span class="${latest.processed.humidity}">${latest.humidity}%</span></b>
                    </div>
                    <div class="twoCol lightCol">
                        <div class="rows">
                            <b class="entry" id ="moisture">Moisture: <span class="${latest.processed.moisture}">${latest.moisture*100}%</span></b>
                            <b class="entry" id ="watered">Last watered: <span>${timeAgo(parseInt(json.last_moistured))}</span></b>
                            <b class="entry" id ="recommendation"><span>${json.processed.recommendation}<span></b>
                        </div>
                        

                        <div class="chartDIV">

                            <svg class="chart">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="${(450-450)/2}%"   stop-color="#0046ff"/>
                                    <stop offset="${(500-450)/2}%"   stop-color="#00ff92"/>
                                    <stop offset="${(550-450)/2}%" stop-color="#a3ff00"/>
                                    <stop offset="${(570-450)/2}%" stop-color="#e1ff00"/>
                                    <stop offset="${(600-450)/2}%" stop-color="#ffbe00"/>
                                    <stop offset="${(650-450)/2}%" stop-color="#ff0000"/>
                                    </linearGradient>
                                </defs>
                                <path d="${path}" />
                            </svg>


                            <b id ="lightstatus">Light levels: <span class="${latest.processed.light}">${latest.lightstatus}</span></b>
                        </div>

                        
                    </div>
                </div>
                `


                buttons.className="oneCol"
                buttons.querySelector('.details').style.display="none"
                buttons.querySelector('.delete').innerHTML="Close"
            }
        })
    })

    buttons.querySelector(".delete").addEventListener("click", (e) => {
        if (e.target.innerHTML == "Close") {
            front.innerHTML = frontHTML
            buttons.className="twoCol"
            buttons.querySelector('.details').style.display=""
            buttons.querySelector('.delete').innerHTML="Delete"
            front.className = "front"

            const plantDIV = e.target.parentElement.parentElement
            const siblings = getSiblings(plantDIV)

            siblings.forEach(sibling => sibling.style.display = "")
            plantDIV.style.width = ''
        
        } else {

            e.preventDefault()

            fetch(`/get/plant/${getCookie("username")}/${plant.id}`,{
                method: 'DELETE',
                headers: {
                    token: getCookie("token")
                }
            })
            .then(res => {return res.json()})
            .then((json) => {
                if (json.message == "Deleted successfully") {
                    const plants = document.querySelectorAll('.plant')
                    const plant = e.target.parentElement.parentElement
                    const names = Array.from(plants).map(el => el.plantname)
                    const index = names.indexOf(plant.plantname)
                    // plant.remove()

                    if (plants.length > 2) {
                        let counter = index
                        while (counter < plants.length-1) {
                            const plants2 = document.querySelectorAll('.plant')
                            swapElements(plants2[counter],plants2[counter+1])
                            counter++
                        }
                    }
                    const plants3 = document.querySelectorAll('.plant')
                    plants3[plants3.length-1].remove()

                    // for (let i=index; i<plants.length-1; i++) {
                    //     swapElements(plants[i],plants[i+1])
                    //     // plants[i].parentNode.replaceChild(plants[i],plants[i+1])
                    // }
                }

            })

        }
    })

    const main = document.querySelector('.main')
    const last = main.children[main.children.length-1]
    if (last.children.length == 3) {
        const threeCol = document.createElement('div')
        threeCol.className='threeCol'
        threeCol.appendChild(div)
        main.appendChild(threeCol)
    } else {
        last.appendChild(div)
    }
}

function swapElements(obj1, obj2) {
    // create marker element and insert it where obj1 is
    var temp = document.createElement("div");
    obj1.parentNode.insertBefore(temp, obj1);

    // move obj1 to right before obj2
    obj2.parentNode.insertBefore(obj1, obj2);

    // move obj2 to right before where obj1 used to be
    temp.parentNode.insertBefore(obj2, temp);

    // remove temporary marker node
    temp.parentNode.removeChild(temp);
}


function clearPlants() {
    document.querySelectorAll(".plant").forEach(el => el.remove())
    const rows = document.querySelectorAll(".main > .threeCol")
    for (let i=1; i<rows.length; i++) rows[i].remove()
}

let add_delay = 100

function populate() {
    fetch(`/get/plants/${getCookie("username")}`,{
        method: 'GET',
        headers: {
            token: getCookie('token')
        }
    })
    .then(res => {return res.json()})
    .then(json => {
        setTimeout(() => {
            addPlantDIVs(json) 
        },add_delay)
    })
}
populate()

async function addPlantDIVs(json) {
    addPlantDIV(json[0])
    if (json.length > 1) {
        json = json.slice(1,json.length)
        setTimeout(() => {
            addPlantDIVs(json)
        },add_delay)
    }    
}

var getSiblings = function (elem) {

	// Setup siblings array and get the first sibling
	var siblings = [];
	var sibling = elem.parentNode.firstChild;

	// Loop through each sibling and push to the array
	while (sibling) {
		if (sibling.nodeType === 1 && sibling !== elem) {
			siblings.push(sibling);
		}
		sibling = sibling.nextSibling
	}

	return siblings;

};
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function timeAgo(someDateInThePast) {
    var result = '';
    var difference = Date.now() - someDateInThePast;

    if (difference < 5 * 1000) {
        return 'just now';
    } else if (difference < 90 * 1000) {
        return 'moments ago';
    }

    //it has minutes
    if ((difference % 1000 * 3600) > 0) {
        if (Math.floor(difference / 1000 / 60 % 60) > 0) {
            let s = Math.floor(difference / 1000 / 60 % 60) == 1 ? '' : 's';
            result = `${Math.floor(difference / 1000 / 60 % 60)} minute${s} `;
        }
    }

    //it has hours
    if ((difference % 1000 * 3600 * 60) > 0) {
        if (Math.floor(difference / 1000 / 60 / 60 % 24) > 0) {
            let s = Math.floor(difference / 1000 / 60 / 60 % 24) == 1 ? '' : 's';
            result = `${Math.floor(difference / 1000 / 60 / 60 % 24)} hour${s}${result == '' ? '' : ''} ` //+ result; //,
        }
    }

    //it has days
    if ((difference % 1000 * 3600 * 60 * 24) > 0) {
        if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
            let s = Math.floor(difference / 1000 / 60 / 60 / 24) == 1 ? '' : 's';
            result = `${Math.floor(difference / 1000 / 60 / 60 / 24)} day${s}${result == '' ? '' : ''} ` //+ result;
        }

    }

    return result + ' ago';
}