let axios = require('axios');
let fs = require('fs');
let express = require('express');

function accordion(title, products) {
    let value = `<div class="accordion" id="accordion${title.split(" ")[0]}">
    <div class="card">
        <div class="card-header" id="heading${title.split(" ")[0]}">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${title.split(" ")[0]}"
                    aria-expanded="false" aria-controls="collapse${title.split(" ")[0]}">
                    ${title}
                </button>
            </h2>
        </div>

        <div id="collapse${title.split(" ")[0]}" class="collapse" aria-labelledby="heading${title.split(" ")[0]}" data-parent="#accordion${title.split(" ")[0]}">
            <div class="card-body">
                ##REPLACE##
            </div>
        </div>
    </div>
</div>`;
    let replace = "";
    for(let product of products){
        replace += `<div class="card" style="width: 18rem;">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
            <h5 class="card-title">${product.name} [$${product.price}]</h5>
            <p class="card-text">${product.description}</p>
            <a href="#" class="btn btn-primary">Add to cart</a>
        </div>
    </div>`;
    
    }
    value = value.replace(/##REPLACE##/gi, replace);
    return value;
}

function file(res, cambio){
    fs.readFile("index.html", (err,data)=>{
        if(err) throw err;
        let final = data.toString();
        final = final.replace(/##CAMBIO##/gi, cambio);
        res.send(final);
    });
}

let app = express();
app.get("/", (req, res) => {
    axios.get('https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/abb6016942f7db2797846988b039005c6ea62c2f/categories.json')
        .then((resp) => {
            let datos = resp.data;
            let injection = "";
            for (let tipo of datos) {
                injection += accordion(tipo["name"], tipo["products"]);
            }
            file(res, injection);
        });
});

app.listen(8081);