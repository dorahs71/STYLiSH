import { ajax, cartNum, search, renderHeader, renderFooter } from "./reset.js";

renderHeader();
renderFooter();
cartNum();
search();

let page;
let index;
const getUrlString = window.location.href;
const newUrl = new URL(getUrlString);
const tag = newUrl.searchParams.get("tag");
const url = "https://api.appworks-school.tw/api/1.0/products/";

function render(list) {
  page = list.next_paging;
  const arr = list.data;
  const container = document.getElementById("products");
  const containerNo = document.getElementById("no-products");

  if (arr.length === 0) {
    containerNo.innerHTML = "<h2>Sorry, 搜尋不到產品喔</h2>";
  }

  arr.forEach((product) => {
    const productLink = document.createElement("a");
    productLink.classList.add("product");
    productLink.href = `product.html?id=${product.id}`;

    const img = document.createElement("img");
    img.src = product.main_image;
    img.alt = "clothings";

    const colorsDiv = document.createElement("div");
    colorsDiv.classList.add("product_colors");
    function showColor() {
      const num = product.colors.length;
      for (let i = 0; i < num; i += 1) {
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("product_color");
        colorDiv.style.backgroundColor = `#${product.colors[i].code}`;
        colorsDiv.appendChild(colorDiv);
      }
    }
    showColor();

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("product_title");
    titleDiv.textContent = product.title;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("product_price");
    priceDiv.textContent = `TWD.${product.price}`;

    container.appendChild(productLink);
    productLink.append(img, colorsDiv, titleDiv, priceDiv);
  });
}

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight === scrollHeight) {
    if (page === undefined) {
      return;
    }
    if (!tag) {
      ajax(`${url}all?paging=${page}`, render);
    } else {
      ajax(`${url}${tag}?paging=${page}`, render);
    }
  }
});

const tagHover = (type) => {
  const clickTag = document.querySelectorAll(`.tag.${type}`);
  for (let i = 0; i < 2; i += 1) {
    clickTag[i].className += " selected";
  }
};

const getTag = () => {
  if (!tag) {
    ajax(`${url}all`, render);
  } else if (tag === "men") {
    ajax(`${url}men`, render);
    tagHover("men");
  } else if (tag === "women") {
    ajax(`${url}women`, render);
    tagHover("women");
  } else if (tag === "accessories") {
    ajax(`${url}accessories`, render);
    tagHover("accessories");
  } else {
    ajax(`${url}search?keyword=${tag}`, render);
  }
};

const remove = () => {
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");
  slides.forEach((slide) => {
    const v = slide;
    v.className = "slides";
  });
  dots.forEach((dot) => {
    const w = dot;
    w.className = "dot";
  });
};

const autoplay = () => {
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");
  const slideChangeTime = 5000;
  setInterval(() => {
    index += 1;
    if (index === slides.length) {
      index = 0;
    }
    remove();
    slides[index].className += " slides-active";
    dots[index].className += " dot-active";
  }, slideChangeTime);
};

const clickImg = () => {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    const a = dot;
    a.addEventListener("click", () => {
      const slides = document.querySelectorAll(".slides");
      const { id } = dot.dataset;
      if (slides[id]) {
        remove();
        slides[id].className += " slides-active";
        a.className += " dot-active";
      }
    });
  });
};

const showSlides = () => {
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");
  index = 0;
  slides[index].className += " slides-active";
  dots[index].className += " dot-active";

  clickImg();
  autoplay();
};

const renderCampaign = (list) => {
  const arr = list.data;
  const slidesCon = document.getElementById("campaigns");
  const dotsCon = document.getElementById("dots");
  let htmlCampaign = "";
  let htmlDot = "";
  arr.forEach((slide) => {
    htmlCampaign = `
    <a 
      href="./product.html?id=${slide.product_id}"
      class="slides"
      style="background-image: url('${slide.picture}');"
    >
      <div class="campaign_story">${slide.story}</div>
    </a>`;
    slidesCon.insertAdjacentHTML("beforeend", htmlCampaign);
  });

  for (let i = 0; i < arr.length; i += 1) {
    htmlDot = `<div class="dot" data-id=${i}></div>`;
    dotsCon.insertAdjacentHTML("beforeend", htmlDot);
  }
  showSlides();
};

ajax(
  "https://api.appworks-school.tw/api/1.0/marketing/campaigns",
  renderCampaign
);
getTag();
