querySelector = (selectors, element) => !element ? document.querySelector(selectors) : element.querySelector(selectors); // Criado para melhorar a leitura do codigo.
querySelectorAll = (selectors, element) => !element ? document.querySelectorAll(selectors) : element.querySelectorAll(selectors); // Criado para melhorar a leitura do codigo.

// NOTA: As classes de algumas areas são unicas e da para obte-las com menos selectors... Entretanto foi feito dessa forma para melhor localização de onde o element esta vindo por parte de outros leitores.

let carrinho = [];
let pizza;

const pizzaCarrinhoHeader = querySelector('header .menu-openner');
const pizzaCarrinho = querySelector('aside');
const buttonClose = querySelector('.cart--area .menu-closer', pizzaCarrinho);
const buttonFinalizar = querySelector('.cart--area .cart--details .cart--finalizar', pizzaCarrinho);
const pizzaPopup = querySelector('.pizzaWindowArea');

buttonClose.addEventListener('click', () => {
    pizzaCarrinho.style.left = '100vw';
    pizzaCarrinho.style.width = null;
});

buttonFinalizar.addEventListener('click', () => {
    carrinho = [];
    const resumoCarrinho = this.querySelector('span', pizzaCarrinhoHeader);
    resumoCarrinho.innerHTML = carrinho.length;
    this.onCarrinho();
    pizzaCarrinho.style.left = '100vw';
    pizzaCarrinho.style.width = null;
});

pizzaCarrinhoHeader.addEventListener('click', () => {
    pizzaCarrinho.style.left = '0vw';
    pizzaCarrinho.style.width = null;
});

inicializarModalQuantidade = () => {
    const pizzaAdicionar = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--pricearea .pizzaInfo--price .pizzaInfo--qtarea .pizzaInfo--qtmais', pizzaPopup);
    const pizzaRemover = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--pricearea .pizzaInfo--price .pizzaInfo--qtarea .pizzaInfo--qtmenos', pizzaPopup);
    const pizzaCancel = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--cancelButton', pizzaPopup);
    const pizzaCarrinho = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--addButton', pizzaPopup);

    pizzaCancel.addEventListener('click', () => pizzaPopup.style.display = 'none');
    pizzaAdicionar.addEventListener('click', (e) => this.onAlterarQuantidade(e, +1));
    pizzaRemover.addEventListener('click', (e) => this.onAlterarQuantidade(e, -1));
    pizzaCarrinho.addEventListener('click', () => this.onAdicionarCarrinho());

}

getPizzaModel = (entidade) => {
    const pizzaModel = this.querySelector('.models .pizza-item').cloneNode(true);
    const pizzaImg = this.querySelector('.pizza-item--img img', pizzaModel);
    const pizzaPrice = this.querySelector('.pizza-item--price', pizzaModel);
    const pizzaName = this.querySelector('.pizza-item--name', pizzaModel);
    const pizzaDesc = this.querySelector('.pizza-item--desc', pizzaModel);
    const pizzaClick = this.querySelector('a', pizzaModel);

    pizzaImg.src = entidade.img;
    pizzaPrice.innerHTML = `R$ ${entidade.price.toFixed(2)}`;
    pizzaName.innerHTML = entidade.name;
    pizzaDesc.innerHTML = entidade.description;
    pizzaClick.addEventListener('click', (e) => {
        e.preventDefault();
        this.onPizza(entidade);
    });

    return pizzaModel;
}

onPizzaTamanho = (img, price, sizes, item) => {
    const key = parseInt(item.getAttribute('data-key'));
    const map = new Map();
    pizza.sizes.forEach((e) => {
        map.set(e, parseInt(e.replace('g', '')));// Mapemos as gramas e o valor delas.
    });

    const tamanho = map.get(pizza.sizes[key]);//Pegamos o tamanho da pizza já convertido para integer.
    const maior = Array.from(map.values()).sort((a, b) => b - a)[0];//Pegamos o maior tamanho possivel da pizza.

    const itemCarrinho = carrinho.find(e => e.id === pizza.id);
    const quantidade = itemCarrinho ? itemCarrinho.quantidade : 1;

    price.innerHTML = `R$ ${(pizza.price * quantidade).toFixed(2)}`;//Resetamos o valor para o original
    img.style.width = null;//Resetamos o width para o original
    img.style.height = null;//Resetamos o height para o original

    pizza.priceAtual = pizza.price;

    if(maior !== tamanho){
        const value = (((100 * tamanho) / maior) + 10).toFixed(2);//Calculamos o percentual do tamanho atual da pizza com base no maior tamanho.
        img.style.width = `${value}%`;//Alteramos o width conforme o percentual
        img.style.height = `${value}%`;//Alteramos o height conforme o percentual

        const total = ((pizza.price - ((pizza.price * (100 - value)) / 100)) + 2);

        pizza.priceAtual = total;

        price.innerHTML = `R$ ${(total * quantidade).toFixed(2)}`;//Calculamos o tamanho com base no percentual e adicionamos (R$ 2).
    }

    sizes.forEach(e => e.classList.remove('selected'));//Removemos a classe selecionadora de todos os itens.
    item.classList.add('selected');//Adicionamos a classe selecionadora nos itens atuais.
}

onAlterarQuantidade = (event, qtd) => {
    const pizzaPrice = this.querySelector('.pizzaInfo--price .pizzaInfo--actualPrice', event.target.parentElement.parentElement);
    const pizzaQuantidade = this.querySelector('.pizzaInfo--qt', event.target.parentElement);
    const quantidade = parseInt(pizzaQuantidade.innerHTML) + qtd;
    pizzaQuantidade.innerHTML = quantidade;
    pizzaPrice.innerHTML = `R$ ${(pizza.price * quantidade).toFixed(2)}`;
}

onAdicionarCarrinho = () => {
    const pizzaQuantidade = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--pricearea .pizzaInfo--price .pizzaInfo--qtarea .pizzaInfo--qt', pizzaPopup);
    const quantidade = parseInt(pizzaQuantidade.innerHTML);

    if(quantidade){

        const itemCarrinho = carrinho.find(e => e.id === pizza.id);

        if(itemCarrinho){

            itemCarrinho.quantidade = quantidade;
            itemCarrinho.priceAtual = pizza.priceAtual;

        }else {

            const item = JSON.parse(JSON.stringify(pizza));
            item.quantidade = quantidade;
            carrinho.push(item);

        }

    }else {

        const item = carrinho.find(e => e.id === pizza.id);

        if(item){

            carrinho.splice(carrinho.indexOf(item), 1);

        }

    }

    pizzaPopup.style.display = 'none';

    const resumoCarrinho = this.querySelector('span', pizzaCarrinhoHeader);

    resumoCarrinho.innerHTML = carrinho.length;

    if(carrinho.length > 0){

        this.onCarrinho();

    }else {

        pizzaCarrinho.style.width = '0vw';

    }
}

onCarrinho = () => {

    const subTotalLabel = this.querySelector('.cart--area .cart--details .cart--totalitem.subtotal span:last-child', pizzaCarrinho);
    const descontoLabel = this.querySelector('.cart--area .cart--details .cart--totalitem.desconto span:last-child', pizzaCarrinho);
    const valorLabel = this.querySelector('.cart--area .cart--details .cart--totalitem.total.big span:last-child', pizzaCarrinho);

    const subTotal = carrinho.length > 0 ? carrinho.map(e => e.priceAtual * e.quantidade).reduce((a, b) => a + b) : 0;

    const desconto = ((subTotal * 10) / 100);

    const valor = (subTotal - desconto).toFixed(2);

    subTotalLabel.innerHTML = `R$ ${subTotal.toFixed(2)}`;
    descontoLabel.innerHTML = `R$ ${desconto.toFixed(2)}`;
    valorLabel.innerHTML = `R$ ${valor}`;

    pizzaCarrinho.style.width = 'unset';

}

onPizza = (entidade) => {
    pizza = entidade;
    pizza.priceAtual = pizza.price;
    const pizzaImg = this.querySelector('.pizzaWindowBody .pizzaBig img', pizzaPopup);
    const pizzaName = this.querySelector('.pizzaWindowBody .pizzaInfo h1', pizzaPopup);
    const pizzaDesc = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--desc', pizzaPopup);
    const sizes = this.querySelectorAll('.pizzaWindowBody .pizzaInfo .pizzaInfo--sizearea .pizzaInfo--sizes .pizzaInfo--size', pizzaPopup);
    const pizzaPrice = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--pricearea .pizzaInfo--price .pizzaInfo--actualPrice', pizzaPopup);
    const pizzaQuantidade = this.querySelector('.pizzaWindowBody .pizzaInfo .pizzaInfo--pricearea .pizzaInfo--price .pizzaInfo--qtarea .pizzaInfo--qt', pizzaPopup);

    const itemCarrinho = carrinho.find(e => e.id === entidade.id);
    const quantidade = itemCarrinho ? itemCarrinho.quantidade : 1;

    pizzaImg.src = entidade.img;
    pizzaName.innerHTML = entidade.name;
    pizzaDesc.innerHTML = entidade.description;
    pizzaPrice.innerHTML = `R$ ${(entidade.price * quantidade).toFixed(2)}`;
    pizzaQuantidade.innerHTML = quantidade;
    sizes.forEach(e => e.classList.remove('selected'));//Removemos a classe selecionadora de todos os itens.
    sizes[entidade.sizes.length - 1].classList.add('selected');//Adicionamos a classe selecionadora no maior item.
    pizzaImg.style.width = null;//Resetamos o width para o original
    pizzaImg.style.height = null;//Resetamos o height para o original

    sizes.forEach((element) => {
        const key = parseInt(element.getAttribute('data-key'));
        element.innerHTML = entidade.sizes[key];
        element.addEventListener('click', () => this.onPizzaTamanho(pizzaImg, pizzaPrice, sizes, element));
    });

    pizzaPopup.style.display = 'flex';

}

function listar() {

    const pizzasArea = this.querySelector('.pizza-area');

    const itens = pizzaJson.map(e => this.getPizzaModel(e));

    pizzasArea.append(...itens);

}

inicializarModalQuantidade();
listar();