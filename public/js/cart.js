import {
  cartNum,
  search,
  renderHeader,
  renderFooter,
  showAlert,
  alertEvent,
  backIndex,
} from "./reset.js";

renderHeader();
renderFooter();
cartNum();
search();

let cart;
let userData;
let prime;
let token;
const freight = 60;
const itemDiv = document.getElementById("items");
const message = {
  cartEmpty: "購物車是空的呦，要開始shopping嗎？",
  itemRemoved: "此商品已經刪除囉",
  nameEmpty: "請記得填寫收件人姓名呦",
  emailEmpty: "請記得填寫收件人Email呦",
  wrongEmail: "請輸入有效的Email呦",
  phoneEmpty: "請記得填寫收件人手機號碼呦",
  wrongPhone: "請輸入有效的收件人手機號碼呦",
  addressEmpty: "請記得填寫收件人地址呦",
  emptyCreditNumber: "請記得填寫信用卡號碼呦",
  emptyExpire: "請記得填寫有效期限呦",
  emptyCcv: "請記得填寫信用卡後三碼呦",
  wrongCreditNumber: "信用卡號碼有誤，請再確認",
  wrongExpire: "有效期限有誤，請再確認",
  wrongCcv: "ccv有誤，請再確認",
  cartNotLogin: "請登入會員後再購買商品呦",
};

const titleCartNum = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const titleCount = document.getElementById("title");
  const newCount = cart.length;
  titleCount.innerHTML = `購物車(${newCount})`;
};

function showQtySelection(stock, qty) {
  let selectHtml = "";
  for (let i = 1; i <= stock; i += 1) {
    if (i === qty) {
      selectHtml += `<option value="${qty}" selected="selected">${qty}</option>`;
    } else {
      selectHtml += `<option value="${i}">${i}</option>`;
    }
  }
  return selectHtml;
}

const renderCartItem = () => {
  const itemsContainer = document.getElementById("items");
  let html = "";
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach((item) => {
    html = `
    <div class="item">
            <img
              class="item_image" alt="clothing"
              src="${item.image}";
            />
            <div class="item_detail">
              <div class="item_name">${item.name}</div>
              <div class="item_id">${item.id}</div>
              <div class="item_color">顏色｜${item.color.name}</div>
              <div class="item_size">尺寸｜${item.size}</div>
            </div>
            <div class="item_quantity">
              <div class="mobile-text">數量</div>
              <select name="quantity" class="qtySelect">
               ${showQtySelection(item.stock, item.qty)}
              </select>
            </div>
            <div class="item_price">
              <div class="mobile-text">單價</div>
              NT.${item.price}
            </div>
            <div class="item_subtotal">

            </div>
            <div class="item_remove">
              <img src="./images/cart-remove.png" alt="remove" />
            </div>
      </div>
    `;
    itemsContainer.insertAdjacentHTML("beforeend", html);
  });
};

const showSummary = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const spans = document.getElementsByTagName("span");
  let sum = 0;
  for (let i = 0; i < cart.length; i += 1) {
    sum += cart[i].price * Number(cart[i].qty);
    spans[0].innerHTML = sum;
    spans[2].innerHTML = sum + freight;
  }
  if (cart.length > 0) {
    spans[1].innerHTML = freight;
  }
};

const modifyQty = (e) => {
  if (e.target.classList.contains("qtySelect")) {
    const parent = e.target.parentElement.parentElement;
    const items = document.getElementsByClassName("item");
    cart = JSON.parse(localStorage.getItem("cart"));
    const arr = [...items];
    const i = arr.indexOf(parent);

    const subtotals = document.getElementsByClassName("item_subtotal");
    const subtotalHtml = `<div class="mobile-text">小計</div> NT.${
      cart[i].price * Number(e.target.value)
    }`;
    subtotals[i].innerHTML = subtotalHtml;

    cart[i].qty = Number(e.target.value);
    localStorage.setItem("cart", JSON.stringify(cart));

    showSummary();
  }
};

const showSubtotal = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotals = document.getElementsByClassName("item_subtotal");
  for (let i = 0; i < cart.length; i += 1) {
    const subtotalHtml = `<div class="mobile-text">小計</div> NT.${
      cart[i].price * cart[i].qty
    }`;
    subtotals[i].innerHTML = subtotalHtml;
  }
};

const getCartNum = () => {
  const cartCounts = document.querySelectorAll(".count");
  cartCounts.forEach((count) => {
    const a = count;
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCount = cart.length;
    a.innerHTML = newCount;
  });
};

const summaryRemove = () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const spans = document.getElementsByTagName("span");
  if (cart.length === 0) {
    spans[0].innerHTML = 0;
    spans[1].innerHTML = 0;
    spans[2].innerHTML = 0;
  } else {
    showSummary();
  }
};

const removeItem = (e) => {
  const isItemRemove = e.target.parentElement.classList.contains("item_remove");

  if (isItemRemove) {
    const reParent = e.target.parentElement.parentElement;
    const items = document.getElementsByClassName("item");
    cart = JSON.parse(localStorage.getItem("cart"));
    const arr = [...items];
    const index = arr.indexOf(reParent);
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showAlert("info", message.itemRemoved);
    itemDiv.removeChild(reParent);
    getCartNum();
    titleCartNum();
    summaryRemove();
  }
};

const APP_ID = 12348;
const APP_KEY =
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF";
TPDirect.setupSDK(APP_ID, `${APP_KEY}`, "sandbox");

const fields = {
  number: {
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    element: "#card-expiration-date",
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "卡片後三碼",
  },
};

TPDirect.card.setup({
  fields,
  styles: {
    input: {
      color: "gray",
    },

    ".valid": {
      color: "green",
    },

    ".invalid": {
      color: "red",
    },
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
});

const getlist = () => {
  cart = JSON.parse(localStorage.getItem("cart"));
  const newitem = {};
  const list = cart.map((item) => {
    newitem.id = item.id;
    newitem.name = item.name;
    newitem.price = item.price;
    newitem.color = item.color;
    newitem.size = item.size;
    newitem.qty = item.qty;
    return newitem;
  });
  return list;
};

const getOrderNum = () => {
  const url = "https://api.appworks-school.tw/api/1.0/order/checkout";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const spans = document.getElementsByTagName("span");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const time = document.querySelector('input[name="time"]:checked').value;

  const body = {
    prime: `${prime}`,
    order: {
      shipping: "delivery",
      payment: "credit_card",
      subtotal: Number(`${spans[0].innerHTML}`),
      freight,
      total: Number(`${spans[2].innerHTML}`),
      recipient: {
        name: `${name}`,
        phone: `${phone}`,
        email: `${email}`,
        address: `${address}`,
        time: `${time}`,
      },
      list: getlist(),
    },
  };

  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((order) => {
      window.location = `./thankyou.html?number=${order.data.number}`;
      localStorage.removeItem("cart");
    });
};

const showLoader = () => {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const href = window.location.href.split("?")[0];
  if (href === "./thankyou.html") {
    loader.style.display = "none";
  }
};

const onSubmit = () => {
  const checkCredit = TPDirect.card.getTappayFieldsStatus();

  if (checkCredit.status.number === 1 || checkCredit.status.number === 3) {
    showAlert("info", message.emptyCreditNumber);
  } else if (checkCredit.status.number === 2) {
    showAlert("info", message.wrongCreditNumber);
  } else if (
    checkCredit.status.expiry === 1 ||
    checkCredit.status.expiry === 3
  ) {
    showAlert("info", message.emptyExpire);
  } else if (checkCredit.status.expiry === 2) {
    showAlert("info", message.wrongExpire);
  } else if (checkCredit.status.ccv === 1 || checkCredit.status.ccv === 3) {
    showAlert("info", message.EmptyCcv);
  } else if (checkCredit.status.ccv === 2) {
    showAlert("info", message.wrongCcv);
  }

  TPDirect.card.getPrime((result) => {
    if (result.status === 0) {
      prime = result.card.prime;
      showLoader();
      getOrderNum();
    }
  });
};

const checkForm = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const emailRegxp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;
  const phoneRegxp = /^09[0-9]{8}$/;
  userData = JSON.parse(localStorage.getItem("signData")) || [];
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alertEvent("info", message.cartEmpty, backIndex);
  } else if (userData.length === 0) {
    showAlert("info", message.cartNotLogin);
  } else if (name === "") {
    showAlert("info", message.nameEmpty);
  } else if (email === "") {
    showAlert("info", message.emailEmpty);
  } else if (email !== "" && emailRegxp.test(email) !== true) {
    showAlert("info", message.wrongEmail);
  } else if (phone === "") {
    showAlert("info", message.phoneEmpty);
  } else if (phone !== "" && phoneRegxp.test(phone) !== true) {
    showAlert("info", message.wrongPhone);
  } else if (address === "") {
    showAlert("info", message.addressEmpty);
  } else {
    token = userData.data.access_token;
    onSubmit();
  }
};

renderCartItem();
showSummary();
titleCartNum();
showQtySelection();
showSubtotal();
itemDiv.addEventListener("click", removeItem);
itemDiv.addEventListener("change", modifyQty);

const checkButton = document.getElementById("checkout");
checkButton.addEventListener("click", checkForm);
