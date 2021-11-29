import {
  ajax,
  cartNum,
  search,
  renderHeader,
  renderFooter,
  showAlert,
} from "./reset.js";

renderHeader();
renderFooter();
cartNum();
search();

const productDiv = document.getElementById("product");
const getUrlString = window.location.href;
const newUrl = new URL(getUrlString);
const id = newUrl.searchParams.get("id");
const url = "https://api.appworks-school.tw/api/1.0/products/details";

const showColor = (data) => {
  let color = "";
  for (let i = 0; i < data.length; i += 1) {
    color += `<div class="product_color" data-id=${i} style="background-color: #${data[i].code}"></div>`;
  }
  return color;
};

const showSize = (data) => {
  let size = "";
  for (let i = 0; i < data.length; i += 1) {
    size += `<div class="product_size" data-id=${i}>${data[i]}</div>`;
  }
  return size;
};

const showImg = (data) => {
  let img = "";
  for (let i = 0; i < data.length; i += 1) {
    img += ` <img
          class="product_img" alt="beautiful"
          src="${data[i]}"
        />`;
  }
  return img;
};

const removeDisable = () => {
  const sizes = document.querySelectorAll(".product_size");
  sizes.forEach((size) => {
    const a = size;
    if (a.classList.contains("disabled")) {
      a.className = "product_size";
    }
  });
};

const showNextSize = () => {
  const sizes = document.querySelectorAll(".product_size");
  const selectSize = document.querySelector(".product_size.selected");

  for (let i = 0; i < sizes.length; i += 1) {
    if (!selectSize) {
      if (sizes[0].className === "product_size disabled") {
        sizes[1].className = "product_size selected";
      } else {
        sizes[0].className = "product_size selected";
      }
    }
  }
};

const showDisable = (arr) => {
  const colorSelect = document.querySelector(".product_color.selected").dataset
    .id;
  const sizes = document.querySelectorAll(".product_size");
  const sizeNum = sizes.length;
  const data = arr.variants;
  if (colorSelect) {
    removeDisable();
  }
  for (let i = 0; i < sizeNum; i += 1) {
    if (colorSelect === "0" && data[i].stock === 0) {
      sizes[i].className = "product_size disabled";
      showNextSize();
    } else if (colorSelect === "1" && data[i + sizeNum].stock === 0) {
      sizes[i].className = "product_size disabled";
      showNextSize();
    } else if (colorSelect === "2" && data[i + sizeNum * 2].stock === 0) {
      sizes[i].className = "product_size disabled";
      showNextSize();
    }
  }
};

const pickFirst = (arr) => {
  const colors = document.querySelectorAll(".product_color");
  const sizes = document.querySelectorAll(".product_size");
  colors[0].className += " selected";
  sizes[0].className += " selected";
  showDisable(arr);
};

const quantityBack = () => {
  let count = document.getElementById("quantity").textContent;
  count = 1;
  document.getElementById("quantity").innerHTML = count;
};

const clickColor = (arr) => {
  const colors = document.querySelectorAll(".product_color");
  colors.forEach((color) => {
    color.addEventListener("click", (e) => {
      const colorClick = e.target;
      const colorSelect = document.querySelector(".product_color.selected");
      if (colorSelect) {
        colorSelect.className = "product_color";
      }
      colorClick.className = "product_color selected";
      showDisable(arr);
      if (colorClick.dataset.id !== colorSelect.dataset.id) {
        quantityBack();
      }
    });
  });
};

const clickSize = () => {
  const sizes = document.querySelectorAll(".product_size");
  sizes.forEach((size) => {
    size.addEventListener("click", (e) => {
      const sizeClick = e.target;
      const sizeSelect = document.querySelector(".product_size.selected");
      if (sizeClick.className === "product_size disabled") {
        sizeClick.className = "product_size disabled";
      } else if (sizeSelect) {
        sizeSelect.className = "product_size";
        sizeClick.className = "product_size selected";
        if (sizeClick.dataset.id !== sizeSelect.dataset.id) {
          quantityBack();
        }
      }
    });
  });
};

const isStock = (arr) => {
  const colorIndex = Number(
    document.querySelector(".product_color.selected").dataset.id
  );
  const sizeIndex = document.querySelector(".product_size.selected").dataset.id;
  const sizes = document.querySelectorAll(".product_size");
  const sizeNum = sizes.length;
  let stock;

  if (colorIndex === 0) {
    stock = arr.variants[sizeIndex].stock;
  } else if (colorIndex === 1) {
    stock = arr.variants[Number(sizeIndex) + sizeNum].stock;
  } else if (colorIndex === 2) {
    stock = arr.variants[Number(sizeIndex) + sizeNum * 2].stock;
  }
  return stock;
};

const substract = () => {
  const suButton = document.getElementById("decrement");
  suButton.addEventListener("click", () => {
    let count = document.getElementById("quantity").textContent;
    if (count <= 1) {
      count = 1;
    } else {
      count = Number(count) - 1;
    }
    document.getElementById("quantity").innerHTML = count;
  });
};

const add = (arr) => {
  const addButton = document.getElementById("increment");
  addButton.addEventListener("click", () => {
    let count = document.getElementById("quantity").textContent;
    const stock = isStock(arr);
    if (count >= stock) {
      count = stock;
    } else {
      count = Number(count) + 1;
    }
    document.getElementById("quantity").innerHTML = count;
  });
  substract();
};

const setNewItemInfo = (arr) => {
  const colorIndex = document.querySelector(".product_color.selected").dataset
    .id;
  const sizeIndex = document.querySelector(".product_size.selected").dataset.id;
  const count = document.getElementById("quantity").innerHTML;
  const stock = isStock(arr);
  const newItem = {
    color: arr.colors[colorIndex],
    id: arr.id,
    image: arr.main_image,
    name: arr.title,
    price: arr.price,
    qty: Number(count),
    size: arr.sizes[sizeIndex],
    stock,
  };
  return newItem;
};

const productCartNum = () => {
  const cartCounts = document.querySelectorAll(".count");
  cartCounts.forEach((count) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCount = cart.length;
    const b = count;
    b.innerHTML = newCount;
  });
};

const addNewItem = (arr) => {
  const addCart = document.getElementById("addCart");
  addCart.addEventListener("click", () => {
    const buyItem = JSON.parse(localStorage.getItem("cart")) || [];
    const newBuy = setNewItemInfo(arr);

    const index = buyItem.findIndex(
      (obj) =>
        obj.id === newBuy.id &&
        obj.color.code === newBuy.color.code &&
        obj.size === newBuy.size
    );

    if (index === -1) {
      buyItem.push(newBuy);
    } else {
      buyItem[index].qty = newBuy.qty;
    }
    localStorage.setItem("cart", JSON.stringify(buyItem));
    showAlert("success", "已加入購物車");
    productCartNum();
  });
};

const renderProduct = (list) => {
  const arr = list.data;
  const productHtml = `
    <img class="product_mainImg" alt="clothings"
          src="https://api.appworks-school.tw/assets/${arr.id}/main.jpg"
        />
        <div class="product_detail">
          <div class="product_title">${arr.title}</div>
          <div class="product_id">${arr.id}</div>
          <div class="product_price">TWD.${arr.price}</div>
          <div class="product_variants">
            <div class="product_variant">
              <div class="product_variant-name">顏色｜</div>
              <div class="product_colors">
              ${showColor(arr.colors)}
              </div>
            </div>
            <div class="product_variant">
              <div class="product_variant-name">尺寸｜</div>
              <div class="product_sizes">
                ${showSize(arr.sizes)}
              </div>
            </div>
            <div class="product_variant">
              <div class="product_variant-name">數量｜</div>
              <div class="product_quantity">
                <button id="decrement">-</button>
                <div id="quantity">1</div>
                <button id="increment">+</button>
              </div>
            </div>
          </div>
          <button id="addCart">加入購物車</button>
          <div class="product_note">${arr.note}</div>
          <div class="product_texture">${arr.texture}</div>
          <div class="product_description">${arr.description}</div>
          <div class="product_wash">${arr.wash}</div>
          <div class="product_place">${arr.place}</div>
        </div>
        <div class="seperator">更多產品資訊</div>
        <div class="product_story">
         ${arr.story}
        </div>
       ${showImg(arr.images)}`;
  productDiv.insertAdjacentHTML("afterbegin", productHtml);
  pickFirst(arr);
  clickColor(arr);
  clickSize(arr);
  add(arr);
  addNewItem(arr);
};

const getId = () => {
  if (id) {
    ajax(`${url}?id=${id}`, renderProduct);
  }
};

getId();
