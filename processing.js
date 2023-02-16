const info = [
    // TEMPERATURE
    {
        normal: {
            exp: 21,
            low: 15,
            high: 25
        }
    },
    //HUMIDITY
    {
        normal: {
            exp: 45,
            low: 30,
            high: 60
        }
    },
    // MOISTURE
    {
        normal: {
            exp: 0.25,
            low: 0.1,
            high: 0.5
        }
    },
    // AVG LIGHT
    {
        normal: {
            exp: 1500,
            low: 500,
            high: 10000000
        }
    }
]

const plant_info = {
    "Basil": {
        temperature: "normal",
        humidity: "normal",
        moisture: "normal",
        light_avg: "normal"
    },
    "Mint": {
        temperature: "normal",
        humidity: "normal",
        moisture: "normal",
        light_avg: "normal"
    },
    "Thyme": {
        temperature: "normal",
        humidity: "normal",
        moisture: "normal",
        light_avg: "normal"
    }
}

function check(value,info) {
    if (value > info.exp*0.95 && value < info.exp*1.05) return "perfect"
    if (value > info.low && value < info.high) return "exp"
    if (value <= info.low) return "low"
    return "high"
}

function recommend(data) {
    let strings = []
    if (data[0] == "low") strings.push("too cold")
    if (data[0] == "high") strings.push("too hot")

    if (data[1] == "high") strings.push("too humid")
    if (data[1] == "low") strings.push("not humid enough")

    if (data[2] == "low") strings.push("too moist")
    if (data[2] == "high") strings.push("too dry")

    if (data[3] == "low") strings.push("not getting enough light")
    if (data[3] == "low") strings.push("getting too much light")

    console.log(strings)

    let last = (strings.length > 1) ? " and " + strings[strings.length-1] : strings[strings.length-1]
    strings.pop()
    console.log(strings)
    let first = strings.join(", ")

    
    return "Your plant is " + first + last + "."
}

function process(plant) {
    const lights = Object.keys(plant.light).map(el => parseFloat(plant.light[el]))
    const light_avg = lights.reduce((a,b) => a+b,0)/lights.length
    plant.light_avg = light_avg

    const types = ["temperature","humidity","moisture","light_avg"]
    const data = types.map((type) => check(plant[type],info[type.indexOf(type)][plant_info[tmp.type][type]]) )
    console.log(data)

    return {
        temperature: data[0],
        humidity: data[1],
        moisture: data[2],
        light: data[3],
        recommendation: recommend(data)
    }

    // return {
    //     temperature: check(plant.temperature,temperature_info[plant_info[plant.type].temperature]),
    //     humidity: check(plant.humidity,humidity_info[plant_info[plant.type].humidity]),
    //     moisture: check(plant.moisture,moisture_info[plant_info[plant.type].moisture]),
    //     light: check(light_avg,light_info[plant_info[plant.type].light])
    //     // light: 
    // }
}

const tmp = {
    temperature: 24.16087158203124,
    humidity: 47,
    moisture: 0.3,
    light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 },
    type: "Basil",
}

const tmp2 = { 
    type: "Basil",
    temperature: 41.00731872558594,       
    humidity: 17.027,                     
    last_moistured: 1676455869.383886, 
    moisture: 0.18513834522694475,     
    light: {                           
        '450': '271.634033203125',       
        '500': '806.0528564453125',      
        '550': '900.511962890625',       
        '570': '441.9948425292969',      
        '600': '2272.166015625',         
        '650': '476.9764404296875'                                  
    }                                                             
 }  


module.exports = {process}


